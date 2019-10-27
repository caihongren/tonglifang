<template>
  <div class="mainDraw">
    <toolBar @showProperty="showProperty"></toolBar>

    <leftSide ref="leftSide" @mounted="leftSideMounted" :param="calcLeftSideParam"></leftSide>
    <horizontalSplit :param="calcSplitParam" @change="splitChange"></horizontalSplit>

    <drawContent :param="calcContentParam"></drawContent>
    <propertyBox ref="propertyBox" :param="calcPropertyBoxParam" @hideProperty="hideProperty"></propertyBox>
    <div class="content"></div>
  </div>
</template>
<script type="text/javascript">
import FileSaver from "file-saver";
import leftSide from "./leftSide";
import horizontalSplit from "./horizontalSplit";
import propertyBox from "./propertyBox";
import toolBar from "./toolBar";
import drawContent from "./drawContent";
import XEUtils from "xe-utils";
import uuid from "uuid";
import Lodash from "lodash";
import { mapState, mapMutations } from "vuex";

import mxgraph from "./graph/index";
import { genGraph, destroyGraph, Graph } from "./graph/Graph";

const {
  mxGraph,
  mxOutline,
  mxConstants,
  mxEvent,
  mxCell,
  mxGeometry,
  mxUtils,
  mxEventObject,
  mxConnectionHandler,
  mxStencilRegistry,
  mxPoint,
  mxConnectionConstraint,
  // importFilexml
} = mxgraph;

Object.assign(mxEvent, {
  NORMAL_TYPE_CLICKED: "NORMAL_TYPE_CLICKED"
});

export default {
  name: "mainDraw",
  components: {
    toolBar,
    leftSide,
    horizontalSplit,
    propertyBox,
    drawContent
  },
  computed: {
    ...mapState(["action"]),
    calcLeftSideParam() {
      return this.leftSideParam;
    },
    calcSplitParam() {
      return this.splitParam;
    },
    calcContentParam() {
      return this.contentParam;
    },
    calcPropertyBoxParam() {
      return this.propertyBoxParam;
    }
  },
  data() {
    return {
      isMounted: false,
      bomList: [],
      graph: null,
      leftSideParam: { left: 0, width: 300 },
      splitParam: { left: 300, width: 10 },
      propertyBoxParam: { left: 900, width: 300 },
      contentParam: {
        left: 300,
        top: 51,
        right: 200,
        bottom: 10,
        width: 800,
        layes: ""
      },
      screenWidth: document.documentElement.clientWidth, //屏幕宽度
      screenHeight: document.documentElement.clientHeight //屏幕高度
    };
  },

  watch: {
    screenWidth(v) {
      console.log("watch screenWidth", v);
      this.calcPosition(v);
    },
    action: {
      deep: true,
      handler(n, old) {
        if (n) {
          let actionName = n.name;
          if (actionName == "zoom") {
            this.zoom(n.value);
          } else if (actionName == "export") {
            this.exportString(n.value);
          } else if (actionName == "readFile") {
            this.readFile(n.value);
          } else if (actionName == "importFilexml") {
            this.importFilexml();
          }
        }
      }
    }
  },

  methods: {
    ...mapMutations(["setAction"]),
    calcPosition() {
      if (this.isMounted) {
        let myHeight = this.screenHeight - 100;
        let myWidth = this.screenWidth;
        let leftWidth = this.leftSideParam.width;
        let propertyWidth = this.propertyBoxParam.width;
        let splitLeft = leftWidth;
        let contentLeft = splitLeft + this.splitParam.width;
        let contentWidth = myWidth - contentLeft - propertyWidth;
        this.splitParam.left = splitLeft;
        this.contentParam.left = contentLeft;
        this.contentParam.right = propertyWidth;
        this.contentParam.width = myWidth - contentLeft - propertyWidth;
        console.log(
          "calc myWidth, leftWidth, contentLeft propertyWidth",
          myWidth,
          leftWidth,
          contentLeft,
          propertyWidth
        );

        this.propertyBoxParam.left = myWidth - propertyWidth;
      }
    },
    splitChange(v) {
      console.log("splitChange", v);
      if (v == 1) {
        this.leftSideParam.width = 0;
      } else {
        this.leftSideParam.width = 300;
      }
      this.calcPosition();
    },
    showProperty() {
      this.propertyBoxParam.width = 300;
      this.calcPosition();
    },
    hideProperty() {
      this.propertyBoxParam.width = 0;
      this.calcPosition();
    },
    makeDraggable(sourceEles) {
      console.log("makeDraggable", sourceEles);

      let that = this;
      Array.from(sourceEles).forEach(ele => {
        const dragElt = document.createElement("img");
        dragElt.setAttribute("src", ele.getAttribute("src"));
        dragElt.setAttribute("style", "width:50px;height:50px;");

        mxUtils.makeDraggable(
          ele,
          this.dropValidate,
          function(_graph, evt, target, x, y) {
            that.insertVertex(this.element, target, x, y);
          },
          dragElt,
          null,
          null,
          null,
          true
        );
      });
    },
    dropValidate(evt) {
      const x = mxEvent.getClientX(evt);
      const y = mxEvent.getClientY(evt);
      // 获取 x,y 所在的元素
      const elt = document.elementFromPoint(x, y);
      // 如果鼠标落在graph容器
      if (mxUtils.isAncestorNode(this.graph.container, elt)) {
        return this.graph;
      }
      // 鼠标落在其他地方
      return null;
    },
    insertVertex(dom, target, x, y) {
      let myType = dom.getAttribute("id");
      let p = XEUtils.find(this.bomList, item => item.id == myType);
      if (p) {
        if (p.childrens) {
          this.insertGroup(p, dom, target, x, y);
        } else {
          this.insertCell(p, dom, target, x, y);
        }
      }
    },
    // 处理图片
    img(src) {
      let SRC = src.split("../../static/images/bom/")[1];

      //  console.log(SRC,'图片')
      let path = require("../../static/images/bom/" + SRC);

      return path;
    },
    insertGroup(p, dom, target, x, y) {
      let groupSize = p.size;
      let rootCell = new mxCell(
        p && p.name ? p.name : "",
        new mxGeometry(0, 0, groupSize.width, groupSize.height),
        `svgType;spacingTop=${groupSize.height + 40}`
      );
      rootCell.vertex = true;
      rootCell.data = {
        id: p.id + uuid.v4(),
        element: p,
        type: p.type ? p.type : null
      };
      rootCell.setConnectable(false);
      let childrenList = [];
      for (let i = 0; i < p.childrens.length; i++) {
        let children = p.childrens[i];
        let childProp = XEUtils.find(
          this.bomList,
          item => item.id == children.id
        );
        if (childProp) {
          console.log("childProp", children, childProp);
          let childName = childProp && childProp.name ? childProp.name : "";
          childName = "";
          console.log("childProp.imgSrc ", this.img(childProp.imgSrc));
          let nodeCell = this.graph.insertVertex(
            rootCell,
            null,
            childName,
            children.postion.x,
            children.postion.y,
            50,
            50,
            `svgType;image=${this.img(childProp.imgSrc)}`
          );
          nodeCell.vertex = true;
          nodeCell.data = {
            id: childProp.id + uuid.v4(),
            element: childProp,
            type: childProp.type ? childProp.type : null
          };
          nodeCell.setConnectable(false);
          this.genAnchor(
            nodeCell,
            childProp ? childProp.directionPoints : null
          );
          childrenList.push(nodeCell);
        }
      }
      rootCell.geometry.constraints = [
        new mxConnectionConstraint(new mxPoint(0, 0.5), true),
        new mxConnectionConstraint(new mxPoint(1, 0.5), true)
      ];
      let cells = this.graph.importCells([rootCell], x, y, target);
      if (cells != null && cells.length > 0) {
        this.graph.setSelectionCells(cells);
        this.cellSelected(cells[0]);
      }
    },
    insertCell(p, dom, target, x, y) {
      let oid = p.id + uuid.v4();
      let src = dom.getAttribute("src");
      let cellName = p && p.name ? p.name : "";
      cellName = "";
      console.log("ttupansrc ", src);
      let nodeRootVertex = new mxCell(
        cellName,
        new mxGeometry(0, 0, 50, 50),
        `svgType;image=${src}`
      );

      nodeRootVertex.vertex = true;
      nodeRootVertex.data = {
        id: oid,
        element: p,
        type: p.type ? p.type : null
      };
      nodeRootVertex.setConnectable(false);
      console.log(nodeRootVertex, p);
      this.genAnchor(nodeRootVertex, p ? p.directionPoints : null);

      nodeRootVertex.geometry.constraints = [
        new mxConnectionConstraint(new mxPoint(0, 0.5), true),
        new mxConnectionConstraint(new mxPoint(1, 0.5), true)
      ];
      let cells = this.graph.importCells([nodeRootVertex], x, y, target);
      if (cells != null && cells.length > 0) {
        this.graph.setSelectionCells(cells);
        this.cellSelected(cells[0]);
      }
    },
    listenGraphEvent() {
      let that = this;
      this.graph.addListener(mxEvent.CLICK, (sender, evt) => {
        const cell = evt.properties.cell;
        if (!cell) {
          return;
        }
        console.log("listenGraphEvent", cell);
        that.cellSelected(cell);
      });
    },
    cellSelected(cell) {
      if (cell.data && cell.data.type) {
        let e = Object.assign(cell.data.element, { id: cell.id });
        this.setAction({ name: "componentSelect", value: e });
      }
    },
    initPopupMenu() {
      let that = this;
      this.graph.popupMenuHandler.factoryMethod = function(menu, cell, evt) {
        console.log("initPopupMenu", cell);

        if (cell != null) {
          let selectedCount = that.graph.getSelectionCount();
          if (selectedCount > 1) {
            menu.addItem("组合", null, function() {
              that.graph.setSelectionCell(that.graph.groupCells(null, 100));
            });
          }
          if (
            selectedCount > 0 &&
            that.graph.getModel().getChildCount(that.graph.getSelectionCell()) >
              0
          ) {
            let selectionCell = that.graph.getSelectionCell();
            console.log("getSelectionCell", selectionCell);
            if (
              !selectionCell.data ||
              (selectionCell.children && selectionCell.children.length > 0)
            )
              menu.addItem("拆分", null, function() {
                that.graph.setSelectionCells(that.graph.ungroupCells());
              });
          }
          if (selectedCount > 0) {
            menu.addItem("删除", null, function() {
              that.deleteCells(false);
            });
            menu.addItem("删除(包含连线)", null, function() {
              that.deleteCells(true);
            });
            menu.addSeparator();
            console.log(menu, "右键删除");
          }
        }
      };
    },
    leftSideMounted(list) {
      this.bomList = list;
    },
    genAnchor(nodeRootVertex, list) {
      if (!list && list == null) return;
      console.log(list);
      for (let i = 0; i < list.length; i++) {
        let p = list[i];
        if (p.direction && p.direction.indexOf("left") > -1) {
          let x = 0,
            y = 0;
          if (p.direction == "leftTop") {
            y = 0.03;
          } else if (p.direction == "leftMiddle" || p.direction == "left") {
            y = 0.48;
          } else if (p.direction == "leftBottom") {
            y = 0.97;
          }
          if (p.x && p.x > 0) x = p.x;
          if (p.y && p.y > 0) y = p.y;
          let ac = this.graph.insertVertex(
            nodeRootVertex,
            null,
            "",
            x,
            y,
            2,
            2,
            "shape=ellipse;align=left;verticalAlign=middle;fontSize=10;routingCenterX=-0.5;fontColor=#000000;strokeColor=#000000;"
          );
          ac.geometry.relative = true;
          ac.geometry.offset = new mxPoint(0, 0);
        } else if (p.direction && p.direction.indexOf("right") > -1) {
          let x = 1,
            y = 0;
          if (p.direction == "rightTop") {
            y = 0.03;
          } else if (p.direction == "rightMiddle" || p.direction == "right") {
            y = 0.48;
          } else if (p.direction == "rightBottom") {
            y = 0.97;
          }
          if (p.x && p.x > 0) x = p.x;
          if (p.y && p.y > 0) y = p.y;
          let ac = this.graph.insertVertex(
            nodeRootVertex,
            null,
            "",
            x,
            y,
            2,
            2,
            "shape=ellipse;align=right;verticalAlign=middle;fontSize=10;routingCenterX=0.5;fontColor=#000000;strokeColor=#000000;"
          );
          ac.geometry.relative = true;
          ac.geometry.offset = new mxPoint(-2, 0);
        } else if (p.direction && p.direction == "top") {
          let x = 0.48,
            y = 0;
          if (p.x && p.x > 0) x = p.x;
          if (p.y && p.y > 0) y = p.y;
          let topVertex = this.graph.insertVertex(
            nodeRootVertex,
            null,
            "",
            x,
            y,
            2,
            2,
            "shape=ellipse;align=left;verticalAlign=middle;fontSize=10;fontColor=#000000;strokeColor=#000000;"
          );
          topVertex.geometry.relative = true;
          topVertex.geometry.offset = new mxPoint(0, 0);
        } else if (p.direction && p.direction == "bottom") {
          let x = 0.48,
            y = 1;
          if (p.x && p.x > 0) x = p.x;
          if (p.y && p.y > 0) y = p.y;
          console.log("bottom", x, y, p);
          let bottomVertex = this.graph.insertVertex(
            nodeRootVertex,
            null,
            "",
            x,
            y,
            2,
            2,
            "shape=ellipse;align=left;verticalAlign=middle;fontSize=10;fontColor=#000000;strokeColor=#000000;"
          );
          bottomVertex.geometry.relative = true;
          bottomVertex.geometry.offset = new mxPoint(0, 0);
        }
      }
    },
    zoom(v) {
      if (v == 1) this.graph.zoomIn();
      else this.graph.zoomOut();
    },
    // 导出
    exportString(v) {
      // console.log(this.graph.exportModelXML());

      const xml = this.graph.exportModelXML();
      console.log(xml, "xml");
      this.graph.importModelXML(xml);
      // const blob = new Blob([xml], { type: "text/plain;charset=utf-8" });
      // FileSaver.saveAs(blob, "student.demo.xml");
    },
    // 导出xml
    importFilexml() {
      this.graph.importFilexml()
    },
    // 导入
    readFile(evt) {
      const file = evt.target.files[0];
      const reader = new FileReader();
      reader.onload = e => {
        const txt = e.target.result;
        console.log(txt);
        this.graph.importModelXML(txt);
      };
      reader.readAsText(file);
    },
    deleteCells(includeEdges) {
      // Cancels interactive operations
      this.graph.escape();
      let cells = this.graph.getDeletableCells(this.graph.getSelectionCells());
      console.log(cells, "cells");
      console.log(this.graph);
      if (cells != null && cells.length > 0) {
        let parents = this.graph.model.getParents(cells);
        this.graph.removeCells(cells, includeEdges);

        // Selects parents for easier editing of groups
        if (parents != null) {
          var select = [];

          for (var i = 0; i < parents.length; i++) {
            if (
              this.graph.model.contains(parents[i]) &&
              (this.graph.model.isVertex(parents[i]) ||
                this.graph.model.isEdge(parents[i]))
            ) {
              select.push(parents[i]);
            }
          }
          this.graph.setSelectionCells(select);
        }
      }
    }
  },
  mounted: function() {
    // console.log('leftSide ', this.$refs.leftSide.$el.clientWidth);
    this.isMounted = true;
    let that = this;
    this.calcPosition();
    // _.debounce 是一个通过 lodash 限制操作频率的函数。
    window.onresize = _.debounce(() => {
      that.screenWidth = document.body.clientWidth;
      that.screenHeight = document.body.clientHeight;
    }, 400);
    // window.onresize = function(){ // 定义窗口大小变更通知事件
    //   that.screenWidth = document.documentElement.clientWidth; //窗口宽度
    //   that.screenHeight = document.documentElement.clientHeight; //窗口高度
    // };

    this.graph = genGraph(document.getElementById("canvas"));
    this.initPopupMenu();
    mxConstants.VERTEX_SELECTION_COLOR = "#00a8ff";
    // 将外元素拖拽进画布参考这个例子
    // https://github.com/jinzhanye/mxgraph-demos/blob/master/src/07.drag.html
    setTimeout(() => {
      this.makeDraggable(document.getElementsByClassName("draw-component"));
      this.listenGraphEvent();
    }, 1000);
  },
  beforeDestroy() {
    destroyGraph();
  }
};
</script>
<style lang="scss" scoped type="text/scss" rel="stylesheet/scss">
.mainDraw {
  padding-top: 10px;
  border-top: solid gainsboro 1px;
  .content {
    width: 100%;
    .designerCanvas {
      background-color: #f8f9fa;
      overflow: hidden;
      outline: none;
    }
  }
}
</style>
