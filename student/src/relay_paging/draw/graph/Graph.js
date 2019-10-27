import mxgraph from './index';
import _ from 'lodash';

const {
  mxGraph,
  mxVertexHandler,
  mxConstants,
  mxCellState,
  mxCellHighlight,
  mxPerimeter,
  mxCellEditor,
  mxGraphHandler,
  mxEvent,
  mxStyleRegistry,
  mxEdgeHandler,
  mxEdgeSegmentHandler,
  mxEdgeStyle,
  mxShape,
  mxImage,
  mxGuide,
  mxGraphView,
  mxConnectionConstraint,
  mxPoint,
  mxEventObject,
  mxCodec,
  mxObjectCodec,
  mxUtils,
  mxImageExport,
  mxXmlCanvas2D,
  mxCodecRegistry,
  mxConnectionHandler,
  mxConstraintHandler,
  mxRubberband,
} = mxgraph;

Object.assign(mxEvent, {
  EDGE_START_MOVE: 'edgeStartMove',
  VERTEX_START_MOVE: 'vertexStartMove',
});

const joinNodeSize = 7;
const strokeWidth = 2;

export class Graph extends mxGraph {
  static getStyleDict(cell) {
    return _.compact(cell.getStyle().split(';'))
      .reduce((acc, item) => {
        const [key, value] = item.split('=');
        acc[key] = value;
        return acc;
      }, {});
  }

  static convertStyleToString(styleDict) {
    const style = Object.entries(styleDict)
      .map(([key, value]) => `${key}=${value}`)
      .join(';')
      .replace(/=undefined/g, '');
    return `${style};`;
  }

  static getCellPosition(cell) {
    return _.pick(cell.getGeometry(), ['x', 'y']);
  }

  constructor(container) {
    super(container);
    this._init();
  }

  _init() {
    this._setDefaultConfig();
    this._configConstituent();
    this._putVertexStyle();
    this._setDefaultEdgeStyle();
    this._setAnchors();
    this._configCustomEvent();
    this._updateFixedTerminalPoint();
  }

  _configConstituent() {
    // Redirects selection to parent
    this.selectCellForEvent = (...args) => {
      const [cell] = args;
      if (this.isPart(cell)) {
        args[0] = this.model.getParent(cell);
        mxGraph.prototype.selectCellForEvent.call(this, args);
        return;
      }

      mxGraph.prototype.selectCellForEvent.apply(this, args);
    };

    /**
     * Redirects start drag to parent.
     */
    const graphHandlerGetInitialCellForEvent = mxGraphHandler.prototype.getInitialCellForEvent;
    mxGraphHandler.prototype.getInitialCellForEvent = function getInitialCellForEvent(...args) {
      // this 是 mxGraphHandler
      let cell = graphHandlerGetInitialCellForEvent.apply(this, args);
      if (this.graph.isPart(cell)) {
        cell = this.graph.getModel().getParent(cell);
      }

      return cell;
    };

  }

  _setDefaultConfig() {
    this.setConnectable(true);
    mxEvent.disableContextMenu(this.container);

    // 固定节点大小
    this.setCellsResizable(false);

    // 编辑时按回车键不换行，而是完成输入
    this.setEnterStopsCellEditing(true);
    // 编辑时按 escape 后完成输入
    mxCellEditor.prototype.escapeCancelsEditing = false;
    // 失焦时完成输入
    mxCellEditor.prototype.blurEnabled = true;
    //是否旋转
    mxVertexHandler.prototype.rotationEnabled = true;
    mxVertexHandler.prototype.livePreview = true;
    // 禁止节点折叠
    this.foldingEnabled = false;
    // 文本包裹效果必须开启此配置
    this.setHtmlLabels(true);

    // 拖拽过程对齐线
    mxGraphHandler.prototype.guidesEnabled = true;

    // Alt disables guides
    mxGuide.prototype.isEnabledForEvent = function (evt) {
      return !mxEvent.isAltDown(evt);
    };
    this.connectionHandler.movePreviewAway = false;
    this.connectionHandler.waypointsEnabled = true;
    this.resetEdgesOnConnect = false;
    mxConstants.SHADOWCOLOR = '#C0C0C0';

    mxEdgeHandler.prototype.snapToTerminals = true;
    // 禁止游离线条
    this.setDisconnectOnMove(false);
    // this.setAllowDanglingEdges(false);
    mxGraph.prototype.isCellMovable = cell => !cell.edge;

    // 禁止调整线条弯曲度
    // this.setCellsBendable(false);

    // 禁止从将label从线条上拖离
    // mxGraph.prototype.edgeLabelsMovable = false;
  }

  _updateFixedTerminalPoint() {
    mxGraphView.prototype.updateFixedTerminalPoint = function (edge, terminal, source, constraint) {
      let pt = null;

      if (constraint != null) {
        pt = this.graph.getConnectionPoint(terminal, constraint);
      }

      if (source) {
        edge.sourceSegment = null;
      } else {
        edge.targetSegment = null;
      }

      if (pt == null) {
        let s = this.scale;
        let tr = this.translate;
        let orig = edge.origin;
        let geo = this.graph.getCellGeometry(edge.cell);
        pt = geo.getTerminalPoint(source);

        // Computes edge-to-edge connection point
        if (pt != null) {
          pt = new mxPoint(s * (tr.x + pt.x + orig.x),
            s * (tr.y + pt.y + orig.y));

          // Finds nearest segment on edge and computes intersection
          if (terminal != null && terminal.absolutePoints != null) {
            let seg = mxUtils.findNearestSegment(terminal, pt.x, pt.y);

            // Finds orientation of the segment
            let p0 = terminal.absolutePoints[seg];
            let pe = terminal.absolutePoints[seg + 1];
            let horizontal = (p0.x - pe.x == 0);

            // Stores the segment in the edge state
            let key = (source) ? 'sourceConstraint' : 'targetConstraint';
            let value = (horizontal) ? 'horizontal' : 'vertical';
            edge.style[key] = value;

            // Keeps the coordinate within the segment bounds
            if (horizontal) {
              pt.x = p0.x;
              pt.y = Math.min(pt.y, Math.max(p0.y, pe.y));
              pt.y = Math.max(pt.y, Math.min(p0.y, pe.y));
            } else {
              pt.y = p0.y;
              pt.x = Math.min(pt.x, Math.max(p0.x, pe.x));
              pt.x = Math.max(pt.x, Math.min(p0.x, pe.x));
            }
          }
        }
        // Computes constraint connection points on vertices and ports
        else if (terminal != null && terminal.cell.geometry.relative) {
          pt = new mxPoint(this.getRoutingCenterX(terminal),
            this.getRoutingCenterY(terminal));
        }

        // Snaps point to grid
        /*if (pt != null)
                {
                    let tr = this.graph.view.translate;
                    let s = this.graph.view.scale;

                    pt.x = (this.graph.snap(pt.x / s - tr.x) + tr.x) * s;
                    pt.y = (this.graph.snap(pt.y / s - tr.y) + tr.y) * s;
                }*/
      }

      edge.setAbsoluteTerminalPoint(pt, source);
    };
  }
  _putVertexStyle() {
    const normalTypeStyle = {
      [mxConstants.STYLE_SHAPE]: mxConstants.SHAPE_IMAGE,
      [mxConstants.STYLE_PERIMETER]: mxPerimeter.RectanglePerimeter,
    };
    this.getStylesheet().putCellStyle('normalType', normalTypeStyle);

    const nodeStyle = {
      // 图片样式参考这个例子
      // https://github.com/jinzhanye/mxgraph-demos/blob/master/src/06.image.html
      [mxConstants.STYLE_SHAPE]: mxConstants.SHAPE_LABEL,
      [mxConstants.STYLE_PERIMETER]: mxPerimeter.RectanglePerimeter,
      [mxConstants.STYLE_ROUNDED]: true,
      [mxConstants.STYLE_ARCSIZE]: 6, // 设置圆角程度

      [mxConstants.STYLE_STROKECOLOR]: '#333333',
      [mxConstants.STYLE_FONTCOLOR]: '#333333',
      [mxConstants.STYLE_FILLCOLOR]: '#ffffff',
      //
      [mxConstants.STYLE_LABEL_BACKGROUNDCOLOR]: 'none',

      [mxConstants.STYLE_ALIGN]: mxConstants.ALIGN_CENTER,
      [mxConstants.STYLE_VERTICAL_ALIGN]: mxConstants.ALIGN_TOP,
      [mxConstants.STYLE_IMAGE_ALIGN]: mxConstants.ALIGN_CENTER,
      [mxConstants.STYLE_IMAGE_VERTICAL_ALIGN]: mxConstants.ALIGN_TOP,

      [mxConstants.STYLE_IMAGE_WIDTH]: '46',
      [mxConstants.STYLE_IMAGE_HEIGHT]: '46',
      // [mxConstants.STYLE_SPACING_TOP]: '10',
      // [mxConstants.STYLE_SPACING]: '1',
    };
    this.getStylesheet().putCellStyle('node', nodeStyle);

    const svgTypeStyle = {
      [mxConstants.STYLE_SHAPE]: mxConstants.SHAPE_IMAGE,
      [mxConstants.STYLE_SPACING_TOP]: '70',
      [mxConstants.STYLE_FONTCOLOR]: '#333333',
      [mxConstants.STYLE_PERIMETER]: mxPerimeter.RectanglePerimeter,
    };
    this.getStylesheet().putCellStyle('svgType', svgTypeStyle);

    // 设置选中状态节点的边角为圆角，默认是直角
    const oldCreateSelectionShape = mxVertexHandler.prototype.createSelectionShape;
    mxVertexHandler.prototype.createSelectionShape = function createSelectionShape(...args) {
      const res = oldCreateSelectionShape.apply(this, args);
      res.isRounded = true;
      // style 属性来自 mxShape , mxRectangle 继承自 mxShape
      res.style = {
        arcSize: 6,
      };
      return res;
    };
  }

  _setDefaultEdgeStyle() {
    let edgeStyle = this.getStylesheet().getDefaultEdgeStyle();
    Object.assign(edgeStyle, {
      [mxConstants.STYLE_STROKECOLOR]: '#000000',
      [mxConstants.STYLE_LABEL_BACKGROUNDCOLOR]: '#FFFFFF',
      [mxConstants.STYLE_EDGE]: 'wireEdgeStyle',
      [mxConstants.STYLE_FONTCOLOR]: '#33333',
      [mxConstants.STYLE_FONTSIZE]: '9',
      [mxConstants.STYLE_MOVABLE]: '0',
      [mxConstants.STYLE_STROKEWIDTH]: '2',
      [mxConstants.STYLE_STARTSIZE]: '7',
      [mxConstants.STYLE_ENDSIZE]: '7',
    });
    delete edgeStyle['endArrow'];

    let vertexStyle = this.getStylesheet().getDefaultVertexStyle();
    Object.assign(vertexStyle, {
      [mxConstants.STYLE_GRADIENT_DIRECTION]: 'south',
      [mxConstants.STYLE_STROKECOLOR]: '#000000',
      [mxConstants.STYLE_FILLCOLOR]: 'none',
      [mxConstants.STYLE_FONTCOLOR]: '#33333',
      [mxConstants.STYLE_FONTSIZE]: '10',
      [mxConstants.STYLE_FONTSTYLE]: '0',
      [mxConstants.STYLE_ROUNDED]: '1',
      [mxConstants.STYLE_STROKEWIDTH]: '2',
    });
  }

  _setAnchors() {

    // Makes sure non-relative cells can only be connected via constraints
    this.connectionHandler.isConnectableCell = function (cell) {
      // console.log(this.graph.getModel().isEdge(cell))
      if (this.graph.getModel().isEdge(cell)) {
        return true;
      } else {
        let geo = (cell != null) ? this.graph.getCellGeometry(cell) : null;

        return (geo != null) ? geo.relative : false;
      }
    };
    mxEdgeHandler.prototype.isConnectableCell = (cell) => {
      // console.log(this.connectionHandler.isConnectableCell(cell))
      return this.connectionHandler.isConnectableCell(cell);
    }




    // Overridden to define per-shape connection points
    this.getAllConnectionConstraints = (terminal) => {
      let geo = (terminal != null) ? this.getCellGeometry(terminal.cell) : null;
      if ((geo != null ? !geo.relative : false) &&
        this.getModel().isVertex(terminal.cell) &&
        this.getModel().getChildCount(terminal.cell) == 0) {
        return [new mxConnectionConstraint(new mxPoint(0, 0.5), false),
          new mxConnectionConstraint(new mxPoint(1, 0.5), false)
        ];
      }

      return null;
    };

    // Defines the default constraints for all shapes
    // mxShape.prototype.constraints = [
    //   new mxConnectionConstraint(new mxPoint(0, 0), true),
    //   new mxConnectionConstraint(new mxPoint(0, 1), true),
    //   new mxConnectionConstraint(new mxPoint(1, 0), true),
    //   new mxConnectionConstraint(new mxPoint(1, 1), true),
    //   new mxConnectionConstraint(new mxPoint(0.25, 0), true),
    //   new mxConnectionConstraint(new mxPoint(0.5, 0), true),
    //   new mxConnectionConstraint(new mxPoint(0.75, 0), true),
    //   new mxConnectionConstraint(new mxPoint(0, 0.25), true),
    //   new mxConnectionConstraint(new mxPoint(0, 0.5), true),
    //   new mxConnectionConstraint(new mxPoint(0, 0.75), true),
    //   new mxConnectionConstraint(new mxPoint(1, 0.25), true),
    //   new mxConnectionConstraint(new mxPoint(1, 0.5), true),
    //   new mxConnectionConstraint(new mxPoint(1, 0.75), true),
    //   new mxConnectionConstraint(new mxPoint(0.25, 1), true),
    //   new mxConnectionConstraint(new mxPoint(0.5, 1), true),
    //   new mxConnectionConstraint(new mxPoint(0.75, 1), true)];
  }




  _configCustomEvent() {
    const graph = this;
    const oldStart = mxEdgeHandler.prototype.start;
    mxEdgeHandler.prototype.start = function start(...args) {
      oldStart.apply(this, args);
      graph.fireEvent(new mxEventObject(mxEvent.EDGE_START_MOVE,
        'edge', this.state.cell,
        'source', this.isSource,
      ));
    };


    const oldCreatePreviewShape = mxGraphHandler.prototype.createPreviewShape;
    mxGraphHandler.prototype.createPreviewShape = function createPreview(...args) {
      graph.fireEvent(new mxEventObject(mxEvent.VERTEX_START_MOVE));
      console.log('apply', this, args)
      console.log(oldCreatePreviewShape)
      return oldCreatePreviewShape.apply(this, args);
    };
  }


  getDom(cell) {
    const state = this.view.getState(cell);
    return state.shape.node;
  }

  setStyle(cell, key, value) {
    const styleDict = Graph.getStyleDict(cell);
    styleDict[key] = value;
    const style = Graph.convertStyleToString(styleDict);
    this.getModel().setStyle(cell, style);
  }

  isPart(cell) {
    const state = this.view.getState(cell);
    const style = (state != null) ? state.style : this.getCellStyle(cell);
    return style.constituent === 1;
  }

  deleteSubtree(cell) {
    const cells = [];
    this.traverse(cell, true, (vertex) => {
      cells.push(vertex);
      return true;
    });
    this.removeCells(cells);
  }


  _restoreModel() {
    Object.values(this.getModel().cells)
      .forEach(cell => {
        if (cell.vertex && cell.data) {
          cell.data = JSON.parse(cell.data);
        }
      });
  }

  // 将 data 变为字符串，否则还原时会报错
  _getExportModel() {
    const model = _.cloneDeep(this.getModel());
    // console.log(model,'model')
    Object.values(model.cells)
      .forEach(cell => {
        console.log(cell.geometry)
        if (cell.vertex && cell.data) {
          console.log(cell.data, 'data')
          cell.data = JSON.stringify(cell.data);
        }
      });
    console.log(model, 'model')
    return model;
  }

  importModelXML(xmlTxt) {
    this.getModel().beginUpdate();
    try {
      const doc = mxUtils.parseXml(xmlTxt);
      const root = doc.documentElement;
      // console.log(root,'root')
      // console.log(doc,'doc')
      const dec = new mxCodec(root.ownerDocument);
      // console.log(dec, 'dec')
      // console.log( dec.decode(root, this.getModel()))
      dec.decode(root, this.getModel());
    } finally {
      this.getModel().endUpdate();
    }
    // this._restoreModel();
  }
  exportModelXML() {
    console.log(this.getModel())
    const enc = new mxCodec(mxUtils.createXmlDocument());

    const node = enc.encode(this._getExportModel());

    return mxUtils.getPrettyXml(node);
  }
  importFilexml() {
    console.log(this.getModel())
    const model = _.cloneDeep(this.getModel());
    // json化
    const chunk = [];
    const line=new Map();
    const Port=new Map();
    // console.log(model,'model')
    Object.values(model.cells)
      .forEach(cell => {
        // console.log(cell)
        // console.log(cell.geometry)
        if (cell.vertex && cell.data) {
          let childrens = [];
          let elment = cell.data.element
          Object.values(cell.children).forEach(item => {
            childrens.push(item.id)
            Port.set(item.id,{
              id:item.id,
              name:elment.name,
            })
           
          })
          console.log(cell)
         
          elment.childrens = childrens
          chunk.push(elment)
          // console.log(cell.data, 'data')

        } else if (cell.edge && cell.geometry&&cell.source!=null&&cell.target!=null) {
         let xian={}
          if(Port.has(cell.source.id)&&Port.has(cell.target.id)){
            console.log(cell)
            let e1=Port.get(cell.source.id)
            let e2=Port.get(cell.target.id)
            xian={
              id:cell.id,
              e1:e1.name,
              n1:e1.id,
              e2:e2.name,
              n2:e2.id,
            }
            line.set(cell.id,xian)
          }else{
            console.log(cell)
            let e1=Port.get(cell.source.id)
            let e2=line.get(cell.target.id)
            xian={
              id:cell.id,
              e1:e1.name,
              n1:e1.id,
              e2:e2.e2,
              n2:e2.n2,
            }
            line.set(cell.id,xian)

          }
          

        }
      });

    console.log(chunk)
    console.log(Port)
    console.log(line)

    // 提交到3维度
    const json={
      step: 100,
      elements:[],
    };
    for(let i=0;i<chunk.length;i++){
        json.elements.push({
          id:chunk[i].type,
          type:chunk[i].type,
          data:{},
        })
    }
    line.forEach((res ,index)=>{
      // console.log(res)
      json.elements.push({
        id:"w"+index,
        type:"W",
        data:{
          e1: res.e1,
          n1: res.n1,
          e2: res.e2,
          n2: res.n2,
        },
       
         
       
      })
    })

    console.log(json)

  }

  // 反序列化参考
  importGraph(e) {
    // const graph: mxgraph.mxGraph = this.editor['graph'];
    const file = e.srcElement.files[0];
    const path = window.URL.createObjectURL(file);

    const cells = mx.mxUtils.load(path).getDocumentElement().getElementsByTagName('mxCell');
    const parent = graph.getDefaultParent();
    for (let i = 2; i < cells.length; i++) {
      const cellAttrs = cells[i].attributes;
      if (cellAttrs.vertex) { // is Vertex
        const vertexValue = cellAttrs.value ? cellAttrs.value.value : '';
        // const vertexId = cellAttrs.id.value;
        const geom = cells[i].children[0].attributes;
        const xPos = Number(geom.x.value);
        const yPos = Number(geom.y.value);
        const height = Number(geom.height.value);
        const width = Number(geom.width.value);
        const style = cellAttrs.style.value;
        console.log(style.length);
        graph.insertVertex(parent, null, vertexValue, xPos, yPos, width, height, style);
      }
    }

  }




  exportPicXML() {
    const xmlDoc = mxUtils.createXmlDocument();
    const root = xmlDoc.createElement('output');
    xmlDoc.appendChild(root);

    const {
      scale
    } = this.view;
    // 这个项目画布边宽为0，可以自行进行调整
    const border = 0;

    const bounds = this.getGraphBounds();
    const xmlCanvas = new mxXmlCanvas2D(root);
    xmlCanvas.translate(
      Math.floor((border / scale - bounds.x) / scale),
      Math.floor((border / scale - bounds.y) / scale),
    );
    xmlCanvas.scale(1);

    const imgExport = new mxImageExport();
    imgExport.drawState(this.getView().getState(this.model.root), xmlCanvas);

    const w = Math.ceil(bounds.width * scale / scale + 2 * border);
    const h = Math.ceil(bounds.height * scale / scale + 2 * border);

    const xml = mxUtils.getPrettyXml(root);

    return {
      xml,
      w,
      h,
    };
  }
}

let graph = {};

export const destroyGraph = () => {
  graph.destroy();
  graph = {};
};

export const genGraph = (container) => {
  graph = new Graph(container);
  graph.view.scale = 1;
  graph.setPanning(true);
  graph.setConnectable(true);
  graph.setConnectableEdges(true);
  graph.setDisconnectOnMove(false);
  graph.foldingEnabled = false;
  graph.border = 50;
  graph.panningHandler.isPopupTrigger = function () {
    return false;
  };
  // Enables return key to stop editing (use shift-enter for newlines)
  graph.setEnterStopsCellEditing(true);

  // Adds rubberband selection
  new mxRubberband(graph);

  graph.getAllConnectionConstraints = function (terminal) {
    let geo = (terminal != null) ? this.getCellGeometry(terminal.cell) : null;

    if ((geo != null ? !geo.relative : false) &&
      this.getModel().isVertex(terminal.cell) &&
      this.getModel().getChildCount(terminal.cell) == 0) {
      return [new mxConnectionConstraint(new mxPoint(0, 0.5), false),
        new mxConnectionConstraint(new mxPoint(1, 0.5), false)
      ];
    }

    return null;
  };


  graph.setTooltips(true);
  let getTooltipForCell = graph.getTooltipForCell;
  graph.getTooltipForCell = function (cell) {
    let tip = '';

    if (cell != null) {
      let src = this.getModel().getTerminal(cell, true);

      if (src != null) {
        tip += this.getTooltipForCell(src) + ' ';
      }

      let parent = this.getModel().getParent(cell);

      if (this.getModel().isVertex(parent)) {
        tip += this.getTooltipForCell(parent) + '.';
      }

      tip += getTooltipForCell.apply(this, arguments);

      let trg = this.getModel().getTerminal(cell, false);

      if (trg != null) {
        tip += ' ' + this.getTooltipForCell(trg);
      }
    }

    return tip;
  };

  let connectionHandlerIsStartEvent = graph.connectionHandler.isStartEvent;
  graph.connectionHandler.isStartEvent = function (me) {
    return connectionHandlerIsStartEvent.apply(this, arguments);
  };

  // Avoids any connections for gestures within tolerance except when in wire-mode
  // or when over a port
  let connectionHandlerMouseUp = graph.connectionHandler.mouseUp;
  graph.connectionHandler.mouseUp = function (sender, me) {
    if (this.first != null && this.previous != null) {
      let point = mxUtils.convertPoint(this.graph.container, me.getX(), me.getY());
      let dx = Math.abs(point.x - this.first.x);
      let dy = Math.abs(point.y - this.first.y);

      if (dx < this.graph.tolerance && dy < this.graph.tolerance) {
        // Selects edges in non-wire mode for single clicks, but starts
        // connecting for non-edges regardless of wire-mode
        if (this.graph.getModel().isEdge(this.previous.cell)) {
          this.reset();
        }

        return;
      }
    }

    connectionHandlerMouseUp.apply(this, arguments);
  };
  // 设置拖拽线的过程出现折线，默认为直线
  mxConnectionHandler.prototype.createEdgeState = function (me) {
    console.log('createEdgeState', graph)
    let edge = graph.createEdge();

    if (this.sourceConstraint != null && this.previous != null) {
      edge.style = mxConstants.STYLE_EXIT_X + '=' + this.sourceConstraint.point.x + ';' +
        mxConstants.STYLE_EXIT_Y + '=' + this.sourceConstraint.point.y + ';';
    } else if (graph.model.isEdge(me.getCell())) {
      let scale = graph.view.scale;
      let tr = graph.view.translate;
      let pt = new mxPoint(graph.snap(me.getGraphX() / scale) - tr.x,
        graph.snap(me.getGraphY() / scale) - tr.y);
      edge.geometry.setTerminalPoint(pt, true);
    }

    return graph.view.createState(edge);
  };
  mxConnectionHandler.prototype.isStopEvent = function (me) {
    return me.getState() != null || mxEvent.isRightMouseButton(me.getEvent());
  };
  let mxConnectionHandlerUpdateCurrentState = mxConnectionHandler.prototype.updateCurrentState;
  mxConnectionHandler.prototype.updateCurrentState = function (me) {
    mxConnectionHandlerUpdateCurrentState.apply(this, arguments);

    if (this.edgeState != null) {
      this.edgeState.cell.geometry.setTerminalPoint(null, false);

      if (this.shape != null && this.currentState != null &&
        this.currentState.view.graph.model.isEdge(this.currentState.cell)) {
        // console.log('updateCurrentState', graph.view)
        let scale = graph.view.scale;
        let tr = graph.view.translate;
        let pt = new mxPoint(graph.snap(me.getGraphX() / scale) - tr.x,
          graph.snap(me.getGraphY() / scale) - tr.y);
        this.edgeState.cell.geometry.setTerminalPoint(pt, false);
      }
    }
  };

  // Updates the terminal and control points in the cloned preview.
  mxEdgeSegmentHandler.prototype.clonePreviewState = function (point, terminal) {
    let clone = mxEdgeHandler.prototype.clonePreviewState.apply(this, arguments);
    clone.cell = clone.cell.clone();

    if (this.isSource || this.isTarget) {
      clone.cell.geometry = clone.cell.geometry.clone();

      // Sets the terminal point of an edge if we're moving one of the endpoints
      if (graph.getModel().isEdge(clone.cell)) {
        clone.cell.geometry.setTerminalPoint(point, this.isSource);
      } else {
        clone.cell.geometry.setTerminalPoint(null, this.isSource);
      }
    }

    return clone;
  };

  let mxEdgeHandlerConnect = mxEdgeHandler.prototype.connect;
  mxEdgeHandler.prototype.connect = function (edge, terminal, isSource, isClone, me) {
    let result = null;
    let model = graph.getModel();
    let parent = model.getParent(edge);

    model.beginUpdate();
    console.log(dwadadadwa)
    try {
      result = mxEdgeHandlerConnect.apply(this, arguments);
      let geo = model.getGeometry(result);

      if (geo != null) {
        geo = geo.clone();
        let pt = null;

        if (model.isEdge(terminal)) {
          pt = this.abspoints[(this.isSource) ? 0 : this.abspoints.length - 1];
          pt.x = pt.x / graph.view.scale - graph.view.translate.x;
          pt.y = pt.y / graph.view.scale - graph.view.translate.y;

          let pstate = graph.getView().getState(
            graph.getModel().getParent(edge));

          if (pstate != null) {
            pt.x -= pstate.origin.x;
            pt.y -= pstate.origin.y;
          }

          pt.x -= graph.panDx / graph.view.scale;
          pt.y -= graph.panDy / graph.view.scale;
        }

        geo.setTerminalPoint(pt, isSource);
        model.setGeometry(edge, geo);
      }
    } finally {
      model.endUpdate();
    }

    return result;
  };

  let mxConnectionHandlerCreateMarker = mxConnectionHandler.prototype.createMarker;
  mxConnectionHandler.prototype.createMarker = function () {
    let marker = mxConnectionHandlerCreateMarker.apply(this, arguments);

    // Uses complete area of cell for new connections (no hotspot)
    marker.intersects = function (state, evt) {
      return true;
    };

    // Adds in-place highlighting
    let mxCellHighlightHighlight = mxCellHighlight.prototype.highlight;
    marker.highlight.highlight = function (state) {
      if (this.state != state) {
        if (this.state != null) {
          this.state.style = this.lastStyle;

          // Workaround for shape using current stroke width if no strokewidth defined
          this.state.style['strokeWidth'] = this.state.style['strokeWidth'] || '1';
          this.state.style['strokeColor'] = this.state.style['strokeColor'] || 'none';

          if (this.state.shape != null) {
            this.state.view.graph.cellRenderer.configureShape(this.state);
            this.state.shape.redraw();
          }
        }

        if (state != null) {
          this.lastStyle = state.style;
          state.style = mxUtils.clone(state.style);
          state.style['strokeColor'] = '#00ff00';
          state.style['strokeWidth'] = '3';

          if (state.shape != null) {
            state.view.graph.cellRenderer.configureShape(state);
            state.shape.redraw();
          }
        }

        this.state = state;
      }
    };

    return marker;
  };

  let mxEdgeHandlerCreateMarker = mxEdgeHandler.prototype.createMarker;
  mxEdgeHandler.prototype.createMarker = function () {
    let marker = mxEdgeHandlerCreateMarker.apply(this, arguments);

    // Adds in-place highlighting when reconnecting existing edges
    marker.highlight.highlight = this.graph.connectionHandler.marker.highlight.highlight;

    return marker;
  }

  let mxGraphGetCellStyle = mxGraph.prototype.getCellStyle;
  mxGraph.prototype.getCellStyle = function (cell) {
    let style = mxGraphGetCellStyle.apply(this, arguments);

    if (style != null && this.model.isEdge(cell)) {
      style = mxUtils.clone(style);

      if (this.model.isEdge(this.model.getTerminal(cell, true))) {
        style['startArrow'] = 'oval';
      }

      if (this.model.isEdge(this.model.getTerminal(cell, false))) {
        style['endArrow'] = 'oval';
      }
    }

    return style;
  };

  mxEdgeStyle.WireConnector = function (state, source, target, hints, result) {
    // Creates array of all way- and terminalpoints
    let pts = state.absolutePoints;
    let horizontal = true;
    let hint = null;

    // Gets the initial connection from the source terminal or edge
    if (source != null && state.view.graph.model.isEdge(source.cell)) {
      horizontal = state.style['sourceConstraint'] == 'horizontal';
    } else if (source != null) {
      horizontal = source.style['portConstraint'] != 'vertical';

      // Checks the direction of the shape and rotates
      let direction = source.style[mxConstants.STYLE_DIRECTION];

      if (direction == 'north' || direction == 'south') {
        horizontal = !horizontal;
      }
    }

    // Adds the first point
    // TODO: Should move along connected segment
    let pt = pts[0];

    if (pt == null && source != null) {
      pt = new mxPoint(state.view.getRoutingCenterX(source), state.view.getRoutingCenterY(source));
    } else if (pt != null) {
      pt = pt.clone();
    }

    let first = pt;

    // Adds the waypoints
    if (hints != null && hints.length > 0) {
      // FIXME: First segment not movable
      /*hint = state.view.transformControlPoint(state, hints[0]);
            mxLog.show();
            mxLog.debug(hints.length,'hints0.y='+hint.y, pt.y)

            if (horizontal && Math.floor(hint.y) != Math.floor(pt.y))
            {
                mxLog.show();
                mxLog.debug('add waypoint');

                pt = new mxPoint(pt.x, hint.y);
                result.push(pt);
                pt = pt.clone();
                //horizontal = !horizontal;
            }*/

      for (let i = 0; i < hints.length; i++) {
        horizontal = !horizontal;
        hint = state.view.transformControlPoint(state, hints[i]);

        if (horizontal) {
          if (pt.y != hint.y) {
            pt.y = hint.y;
            result.push(pt.clone());
          }
        } else if (pt.x != hint.x) {
          pt.x = hint.x;
          result.push(pt.clone());
        }
      }
    } else {
      hint = pt;
    }

    // Adds the last point
    pt = pts[pts.length - 1];

    // TODO: Should move along connected segment
    if (pt == null && target != null) {
      pt = new mxPoint(state.view.getRoutingCenterX(target), state.view.getRoutingCenterY(target));
    }

    if (horizontal) {
      if (pt.y != hint.y && first.x != pt.x) {
        result.push(new mxPoint(pt.x, hint.y));
      }
    } else if (pt.x != hint.x && first.y != pt.y) {
      result.push(new mxPoint(hint.x, pt.y));
    }
  };

  mxStyleRegistry.putValue('wireEdgeStyle', mxEdgeStyle.WireConnector);

  let mxGraphCreateHandler = mxGraph.prototype.createHandler;
  mxGraph.prototype.createHandler = function (state) {
    let result = null;

    if (state != null) {
      if (this.model.isEdge(state.cell)) {
        let style = this.view.getEdgeStyle(state);

        if (style == mxEdgeStyle.WireConnector) {
          return new mxEdgeSegmentHandler(state);
        }
      }
    }

    return mxGraphCreateHandler.apply(this, arguments);
  };
  return graph;
};

export const getGraph = () => graph;
