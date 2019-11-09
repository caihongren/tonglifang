<template>
    <div ref="graph_container" class="box" @contextmenu.prevent="show1()"></div>
</template>

<script>
import {
    mxGraph
} from 'mxgraph/javascript/mxClient';

export default {
    name: 'HelloWorld',
    data(){

      return{
          getXml:'',
      }
      
    },
    props: {
        msg: String
    },
    methods:{
        show1(){
        }
    },
    mounted() {
        // Creates the graph inside the given container
        var graph = new mxGraph(this.$refs.graph_container);
 


        // Gets the default parent for inserting new cells. This
        // is normally the first child of the root (ie. layer 0).
        var parent = graph.getDefaultParent();

        // Adds cells to the model in a single step
        graph.getModel().beginUpdate();
        try {
            let v1 = graph.insertVertex(parent, null, 'Hello,', 20, 20, 80, 30,'rounded;strokeColor=none;fillColor=none;');
            let v2 = graph.insertVertex(parent, null, 'World!', 200, 150, 80, 30 , 'shape=ellipse;perimeter=ellipsePerimeter');
            let v3 = graph.insertVertex(parent, null, 'Hello,', 550, 90, 100, 30);

            graph.insertEdge(parent, null, '234', v1, v2 , "strokeWidth=3;labelBackgroundColor=white;fontStyle=1");
             graph.insertEdge(parent, null, '234', v2, v3 , 'edgeStyle=orthogonalEdgeStyle;');
              graph.insertEdge(parent, null, '234', v1, v3 , "strokeWidth=3;labelBackgroundColor=white;fontStyle=1");
        } finally {
            // Updates the display
            graph.getModel().endUpdate();
        }
         
        
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.box{
  width: 100%;
  height: 100%;
}
h3 {
    margin: 40px 0 0;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    display: inline-block;
    margin: 0 10px;
}

a {
    color: #42b983;
}
</style>
