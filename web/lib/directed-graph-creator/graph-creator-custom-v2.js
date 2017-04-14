var global_consts = {
    defaultTitle: "New Node",
    defaultEdgeValue: 0.5,
    graphSvgStartX: 240,
    graphSvgStartY: 107,
    graphStartScale: 0,
};
var global_settings = {
    appendElSpec: "#graph"
};
// var colors = ['red', 'pink', 'purple', 'deep-purple', 'indigo', 'blue',
// 'light-blue', 'cyan', 'teal', 'green', 'light-green', 'lime', 'yellow', 'amber', 'orange',
// 'deep-orange', 'brown', 'grey', 'blue-grey'];

var networkGraph = null;

document.onload = (function(d3, saveAs, Blob, undefined){
    "use strict";

    // TODO add user settings

    // define graphcreator object
    var GraphCreator = function(svg, nodes, edges, nodeTypes, edgeTypes){
        var isChanged = false;
        var zoom = null;
        var thisGraph = this;
        thisGraph.idct = 0;
        thisGraph.edgect = 0;

        thisGraph.EDGE_INTERVAL_START = {
            2: -10, 3: -15, 4: -15, 5: -20,
            6: -20, 7: -21, 8: -28, 9: -28,
            10: -27, 11: -30
        };
        thisGraph.EDGE_INTERVAL = {
            2: 20, 3: 15, 4: 10, 5: 10,
            6: 8, 7: 7, 8: 8, 9: 7,
            10: 6, 11: 6
        };
        thisGraph.EDGE_INTERVAL_MAX_WIDTH = 60;

        thisGraph.EDGE_VIEW_MODE_ALL = 0;
        thisGraph.EDGE_VIEW_MODE_SELECTED = 1;
        thisGraph.EDGE_VIEW_MODE_PATH = 2;
        thisGraph.EDGE_TYPE_DEFAULT = 'default';
        thisGraph.edgeViewMode = thisGraph.EDGE_VIEW_MODE_SELECTED;
        thisGraph.edgeTypeSelectedList = [thisGraph.EDGE_TYPE_DEFAULT];
        thisGraph.edgeInfPathList = [];

        thisGraph.nodes = nodes || [];
        thisGraph.edges = edges || [];
        thisGraph.nodeTypes = nodeTypes || {};
        thisGraph.edgeTypes = edgeTypes || {};

        thisGraph.onNodeSelected = function(d3Node, nodeData){};
        thisGraph.onEdgeSelected = function(d3PathG, edgeData){};
        thisGraph.onUnselected = function(){};
        thisGraph.onNodeChanged = function(event, nodeData){};
        thisGraph.onEdgeChanged = function(event, nodeData){};
        thisGraph.initialValues = {
          position : null,
          scale : 0
        };
        thisGraph.state = {
            selectedNode: null,
            selectedEdge: null,
            mouseDownNode: null,
            mouseDownLink: null,
            justDragged: false,
            justScaleTransGraph: false,
            lastKeyDown: -1,
            shiftNodeDrag: false,
            selectedText: null,
        };

        // define arrow markers for graph links
        var defs = svg.append('svg:defs');
        defs.append('svg:marker')
            // .attr('style', 'fill : #ff0000;')
            .attr('id', 'end-arrow')
            .attr('viewBox', '-1 -5 10 10')
            .attr('refX', "44")
            .attr('markerWidth', 3.5)
            .attr('markerHeight', 3.5)
            .attr('orient', 'auto')
            .append('svg:path')
            .attr('d', 'M0,-5L10,0L0,5');
        defs.append('svg:marker')
            .attr('id', 'end-arrow-hover')
            .attr('viewBox', '-1 -5 10 10')
            .attr('refX', "32")
            .attr('markerWidth', 3.5)
            .attr('markerHeight', 3.5)
            .attr('orient', 'auto')
            .append('svg:path')
            .attr('d', 'M0,-5L10,0L0,5');
        defs.append('svg:marker')
            .attr('id', 'end-arrow-highlight')
            .attr('viewBox', '-1 -5 10 10')
            .attr('refX', "26")
            .attr('markerWidth', 3.5)
            .attr('markerHeight', 3.5)
            .attr('orient', 'auto')
            .append('svg:path')
            .attr('d', 'M0,-5L10,0L0,5');

        function appendMarker(defs) {
            colors.forEach(function (color) {
                console.log(color);
            });
        }
        appendMarker();
        // define arrow markers for leading arrow
        defs.append('svg:marker')
            .attr('id', 'mark-end-arrow')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 7)
            .attr('markerWidth', 3.5)
            .attr('markerHeight', 3.5)
            .attr('orient', 'auto')
            .append('svg:path')
            .attr('d', 'M0,-5L10,0L0,5');

        thisGraph.svg = svg;
        thisGraph.svgG = svg.append("g")
                    .classed(thisGraph.consts.graphClass, true);
        var svgG = thisGraph.svgG;

        // displayed when dragging between nodes
        thisGraph.dragLine = svgG.append('svg:path')
                    .attr('class', 'link dragline hidden')
                    .attr('d', 'M0,0L0,0')
                    .style('marker-end', 'url(#mark-end-arrow)');

        // svg nodes and edges
        thisGraph.paths = svgG.append("g").selectAll("g");
        thisGraph.circles = svgG.append("g").selectAll("g");

        thisGraph.drag = d3.behavior.drag()
            .origin(function(d){
                return {x: d.x, y: d.y};
            })
            .on("drag", function(args){
                thisGraph.state.justDragged = true;
                thisGraph.dragmove.call(thisGraph, args);
            })
            .on("dragend", function() {
                // todo check if edge-mode is selected
            });

        // listen for key events
        d3.select(window).on("keydown", function(){
            thisGraph.svgKeyDown.call(thisGraph);
        })
        .on("keyup", function(){
            thisGraph.svgKeyUp.call(thisGraph);
        });
        svg.on("mousedown", function(d){thisGraph.svgMouseDown.call(thisGraph, d);});
        svg.on("mouseup", function(d){thisGraph.svgMouseUp.call(thisGraph, d);});

        // listen for dragging
        var dragSvg = d3.behavior.zoom()
                    .on("zoom", function(){
                        if (d3.event.sourceEvent.shiftKey){
                            // TODO  the internal d3 state is still changing
                            return false;
                        } else{

                            thisGraph.zoomed.call(thisGraph);
                        }
                        return true;
                    })
                    .on("zoomstart", function(){
                        var ael = d3.select("#" + thisGraph.consts.activeEditId).node();
                        if (ael){
                            ael.blur();
                        }
                        if (!d3.event.sourceEvent.shiftKey) d3.select('body').style("cursor", "move");
                    })
                    .on("zoomend", function(){
                        d3.select('body').style("cursor", "auto");
                    });
        svg.call(dragSvg).on("dblclick.zoom", null);
        console.log("dragSvg Initialized");

        // console.log(zoom);
        // dragSvg.scale(5);


        // listen for resize
        window.onresize = function(){thisGraph.updateWindow(svg);};
    };

    GraphCreator.prototype.setIdCt = function(idct){
        this.idct = idct;
    };

    GraphCreator.prototype.consts =  {
        selectedClass: "selected",
        unviewedClass: "unviewed",
        hightlightClass: "highlight",
        connectClass: "connect-node",
        circleGClass: "conceptG",
        typeColorHead: "type-color-",
        edgeGClass: "edgeG",
        graphClass: "graph",
        activeEditId: "active-editing",
        activeEdgeEditId: "active-edge-editing",
        BACKSPACE_KEY: 8,
        DELETE_KEY: 46,
        ENTER_KEY: 13,
        nodeRadius: 50
    };

    /* PROTOTYPE FUNCTIONS */
    GraphCreator.prototype.dragmove = function(d) {
        var thisGraph = this;
        if (thisGraph.state.shiftNodeDrag){
            thisGraph.dragLine.attr('d', 'M' + d.x + ',' + d.y + 'L' + d3.mouse(thisGraph.svgG.node())[0] + ',' + d3.mouse(this.svgG.node())[1]);
        } else{
            d.x += d3.event.dx;
            d.y +=  d3.event.dy;
            thisGraph.updateGraph();
        }
    };

    GraphCreator.prototype.deleteGraph = function(skipPrompt){
        var thisGraph = this,
            doDelete = true;
        if (!skipPrompt){
            doDelete = window.confirm("Press OK to delete this graph");
        }
        if(doDelete){
            thisGraph.nodes = [];
            thisGraph.edges = [];
            thisGraph.updateGraph();
        }
    };

    /* select all text in element: taken from http://stackoverflow.com/questions/6139107/programatically-select-text-in-a-contenteditable-html-element */
    GraphCreator.prototype.selectElementContents = function(el) {
        var range = document.createRange();
        range.selectNodeContents(el);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    };


    /* insert svg line breaks: taken from http://stackoverflow.com/questions/13241475/how-do-i-include-newlines-in-labels-in-d3-charts */
    GraphCreator.prototype.insertTitleLinebreaks = function (gEl, title) {
        // console.log(title);
        // var words = title.split(/\s+/g),
        //         nwords = words.length;
        // var el = gEl.append("text")
        //             .attr("text-anchor","middle")
        //             .attr("dy", "-" + (nwords-1)*7.5);
        //
        // for (var i = 0; i < words.length; i++) {
        //     var tspan = el.append('tspan').text(words[i]);
        //     if (i > 0)
        //         tspan.attr('x', 0).attr('dy', 15);
        // }

        /* remove split part */
        var el = gEl.append("text")
            .attr("text-anchor", "middle")
            // .attr("textLength", 100);
            .attr("letter-spacing", 0)
            .attr("font-size", 12);
            // .attr("dy", 3);


        var parsedString = new Array();
        if(title.length > 8) {
            var start = 0, end = 8;
            for (var i = 0; ; i++) {
                if(start >= title.length)
                    break;
                parsedString[i] = title.substring(start,end);
                start += 8;
                end += 8;
            }
            if(parsedString.length <= 2) {
                for (var i = 0; i < parsedString.length; i++) {
                    while(true) {
                        if(parsedString[i][0] != ' ')
                            break;
                        if(parsedString[i][0] == ' ' && parsedString[i].length == 1) {
                            parsedString.pop();
                            break;
                        }
                        parsedString[i] = parsedString[i].substring(1 ,parsedString[i].length);
                    }
                    var tspan = el.append('tspan').text(parsedString[i]).attr('x', 0).attr('y', i * 15);
                }
            } else {
                for (var i = 0; i < parsedString.length; i++) {
                    while(true) {
                        if(parsedString[i][0] != ' ')
                            break;
                        if(parsedString[i][0] == ' ' && parsedString[i].length == 1) {
                            parsedString.pop();
                            break;
                        }
                        parsedString[i] = parsedString[i].substring(1 ,parsedString[i].length);
                    }
                    if(i==3 && parsedString.length > 4 ) {
                        if(parsedString[i].length > 7)
                            var tspan = el.append('tspan').text(parsedString[i].substring(0,6) + "...").attr('x', 0).attr('y', - 15 + (i * 15));
                        else
                            var tspan = el.append('tspan').text(parsedString[i]).attr('x', 0).attr('y', - 15 + (i * 15));
                        break;
                    }
                    var tspan = el.append('tspan').text(parsedString[i]).attr('x', 0).attr('y', - 15 + (i * 15));
                }
            }
        } else {
            var tspan = el.append('tspan').text(title);
        }



        // console.log(parsedString);

        // var tspan = el.append('tspan').text(title);

    };

    GraphCreator.prototype.insertEdgeName = function (gEl, d) {
        var thisGraph = this;
        var innerHTML = gEl[0][0]['innerHTML'];

        var attributesD = innerHTML.split("\"")[3];
        var parsedD = attributesD.split("L");
        var parsedM = parsedD[0].split(",");
        var parsedL = parsedD[1].split(",");
        parsedM[0] = parsedM[0].slice(1);
        // console.log(gEl[0][0]);
        // console.log(parsedM);
        // console.log(parsedL);
        var vx = Number(parsedM[0]) - Number(parsedL[0]), vy = Number(parsedM[1]) - Number(parsedL[1]);
        var tx = (Number(parsedM[0]) + Number(parsedL[0]))/2, ty = (Number(parsedM[1]) + Number(parsedL[1]))/2;


        //set edge name position
        // var vx=(d.target.x - d.source.x), vy=(d.target.y - d.source.y);
        var dx=Math.abs(vx), dy=Math.abs(vy);
        var dr=Math.sqrt(dx*dx + dy*dy);
        // var tx=((d.source.x+d.target.x)/2), ty=((d.source.y+d.target.y)/2);
        // if (d.bilateral) {
        //     if (dx >= dy) {
        //         if (d.source.x < d.target.x) {
        //             tx = tx + (20 * vy / dr);
        //             ty = ty - 10 - 20;
        //         } else {
        //             tx = tx + (20 * vy / dr);
        //             ty = ty + 10 + 10;
        //         }
        //     } else {    // dy > dx
        //         if (d.source.y < d.target.y) {
        //             tx = tx + 20 + 10;
        //             ty = ty - (20 * vx / dr);
        //         } else {
        //             tx = tx - 20 - 10 - 5;
        //             ty = ty - (20 * vx / dr);
        //         }
        //     }
        // } else {
        //     if (dx >= dy) {
        //         if (d.source.x < d.target.x) {
        //             tx = tx - (20 * vy / dr);
        //         } else {
        //             tx = tx + (20 * vy / dr);
        //         }
        //         ty = ty + 10 + (10 * dy / dr);
        //     } else {
        //         tx = tx + 20 + (10 * dx / dr);
        //         if (d.source.y < d.target.y) {
        //             ty = ty - (10 * vx / dr);
        //         } else {
        //             ty = ty + (10 * vx / dr) - 10;
        //         }
        //     }
        // }

        var el = gEl.append("text")
                    .attr("text-anchor","middle")
                    .attr("transform", "translate(" + tx + "," + ty + ") rotate(" + Math.atan(vy/vx) * 57.3 + ")")
                    .attr("dy", "13")
                    .attr("dx", "13")
                    .on("mousedown", function(d) {
                        thisGraph.pathTextMouseDown.call(thisGraph, d3.select(this), d);
                    });
        var tspan = el.append('tspan').text(d.name);
        // this.isChanged = true;
        // toggleAskCloseAndRefresh();
    };


    // remove edges associated with a node
    GraphCreator.prototype.spliceLinksForNode = function(node) {
        var thisGraph = this,
            toSplice = thisGraph.edges.filter(function(l) {
            return (l.source === node || l.target === node);
        });
        toSplice.map(function(l) {
            thisGraph.edges.splice(thisGraph.edges.indexOf(l), 1);
        });
    };

    GraphCreator.prototype.replaceSelectNode = function(d3Node, nodeData){
        var thisGraph = this;
        d3Node.classed(this.consts.selectedClass, true);
        if (thisGraph.state.selectedNode){
            thisGraph.removeSelectFromNode();
        }
        thisGraph.state.selectedNode = nodeData;
        thisGraph.onNodeSelected(d3Node, nodeData);
    };

    GraphCreator.prototype.removeSelectFromNode = function(){
        var thisGraph = this;
        thisGraph.circles.filter(function(cd){
            return cd.id === thisGraph.state.selectedNode.id;
        }).classed(thisGraph.consts.selectedClass, false);
        thisGraph.state.selectedNode = null;
        thisGraph.onUnselected();
    };

    GraphCreator.prototype.replaceSelectEdge = function(d3Path, edgeData){
        var thisGraph = this;
        var d3PathG = d3.select(d3Path.node().parentNode);
        d3Path.classed(thisGraph.consts.selectedClass, true);
        d3PathG.classed(thisGraph.consts.selectedClass, true);
        if (thisGraph.state.selectedEdge){
            thisGraph.removeSelectFromEdge();
        }
        thisGraph.state.selectedEdge = edgeData;
        thisGraph.onEdgeSelected(d3PathG, edgeData);
    };

    GraphCreator.prototype.removeSelectFromEdge = function(){
        var thisGraph = this;
        thisGraph.paths.filter(function(cd){
            return cd === thisGraph.state.selectedEdge;
        }).classed(thisGraph.consts.selectedClass, false)
            .select("path").classed(thisGraph.consts.selectedClass, false);
        thisGraph.state.selectedEdge = null;
        thisGraph.onUnselected();
    };

    GraphCreator.prototype.pathMouseDown = function(d3path, d){
        var thisGraph = this,
            state = thisGraph.state;
        d3.event.stopPropagation();
        state.mouseDownLink = d;

        if (d3.event.shiftKey) {
            state.shiftNodeDrag = d3.event.shiftKey;
            return;
        }
    };

    GraphCreator.prototype.pathTextMouseDown = function(d3pathText, d){
        var thisGraph = this,
            state = thisGraph.state;
        d3.event.stopPropagation();
        state.mouseDownLink = d;

        if (d3.event.shiftKey) {
            // not working... because the event node is text element. cannot remove itself in its event handler.
            var d3txt = thisGraph.changeTextOfEdge(d3.select(d3pathText.node().parentNode), d);
            var txtNode = d3txt.node();
            thisGraph.selectElementContents(txtNode);
            txtNode.focus();
        } else {
            if (state.selectedNode){
                thisGraph.removeSelectFromNode();
            }

            var prevEdge = state.selectedEdge;
            if (!prevEdge || prevEdge !== d){
                var d3path = d3.select(d3pathText.node().parentNode).selectAll("path");
                thisGraph.replaceSelectEdge(d3path, d);
            } else{
                thisGraph.removeSelectFromEdge();
            }
        }
    };

    // mousedown on node
    GraphCreator.prototype.circleMouseDown = function(d3node, d){
        var thisGraph = this,
                state = thisGraph.state;
        d3.event.stopPropagation();
        state.mouseDownNode = d;
        if (d3.event.shiftKey){
            state.shiftNodeDrag = d3.event.shiftKey;
            // reposition dragged directed edge
            thisGraph.dragLine.classed('hidden', false)
                .attr('d', 'M' + d.x + ',' + d.y + 'L' + d.x + ',' + d.y);
            return;
        }
    };

    /* place editable text on node in place of svg text */
    GraphCreator.prototype.changeTextOfNode = function(d3node, d) {

        var thisGraph= this,
            consts = thisGraph.consts,
            htmlEl = d3node.node();
        d3node.selectAll("text").remove();
        var nodeBCR = htmlEl.getBoundingClientRect(),
            curScale = nodeBCR.width/consts.nodeRadius,
            // placePad  =  5*curScale,
            useHW = curScale > 1 ? nodeBCR.width*0.71 : consts.nodeRadius*1.42;

        /* apply second menu height or not */
        var state = thisGraph.state,
            secondMenuHeight = 0;
        if(state.selectedNode || state.selectedEdge)
            secondMenuHeight = -31;

        /* Delete Extreme Positon */
        if(curScale < 1) curScale = 1;
        else if(curScale > 5) curScale = 5;

        // replace with editableconent text
        var d3txt = thisGraph.svg.selectAll("foreignObject")
            .data([d])
            .enter()
            .append("foreignObject")
            // .attr("x", nodeBCR.left + placePad - global_consts.graphSvgStartX)
            // .attr("y", nodeBCR.top + placePad - global_consts.graphSvgStartY)
            .attr("x", nodeBCR.left + 7 * curScale - global_consts.graphSvgStartX)
            .attr("y", nodeBCR.top + secondMenuHeight + 40 * curScale - global_consts.graphSvgStartY)
            .attr("height", 2*useHW)
            .attr("width", useHW)
            .append("xhtml:p")
            .attr("id", consts.activeEditId)
            .attr("contentEditable", "true")
            .text(d.title)
            .on("mousedown", function(d){
                d3.event.stopPropagation();
            })
            .on("keydown", function(d){
                d3.event.stopPropagation();
                if (d3.event.keyCode == consts.ENTER_KEY && !d3.event.shiftKey){
                    this.blur();
                }
            })
            .on("blur", function(d){
                d.title = this.textContent;
                thisGraph.insertTitleLinebreaks(d3node, d.title);
                d3.select(this.parentElement).remove();

                if (thisGraph.state.selectedNode == d) {
                    thisGraph.onNodeSelected(d3node, d);
                }
                thisGraph.onNodeChanged('updated', d);
            });
        // this.isChanged= true;
        // toggleAskCloseAndRefresh();
        return d3txt;
    };

    /* place editable text on node in place of svg text */
    GraphCreator.prototype.changeTextOfEdge = function(d3pathG, d) {
        var thisGraph= this,
            consts = thisGraph.consts,
            htmlEl = d3pathG.node(),
            pathEl = d3pathG.selectAll("path").node();
        d3pathG.selectAll("text").remove();

        var nodeBCR = pathEl.getBoundingClientRect(),
            useHW = 60, placePadX = useHW/2, placePadY = useHW/3;
        var px = ((nodeBCR.left+nodeBCR.right)/2) - placePadX - global_consts.graphSvgStartX;
        var py = ((nodeBCR.top+nodeBCR.bottom)/2) - placePadY - global_consts.graphSvgStartY;

        // replace with editable content text
        var d3txt = thisGraph.svg.selectAll("foreignObject")
            .data([d])
            .enter()
            .append("foreignObject")
            .attr("x", px).attr("y", py)
            .attr("height", useHW/2)
            .attr("width", useHW)
            .append("xhtml:p")
            .attr("id", consts.activeEdgeEditId)
            .attr("contentEditable", "true")
            .text(d.name)
            .on("mousedown", function(d) {
                d3.event.stopPropagation();
            })
            .on("keydown", function(d) {
                d3.event.stopPropagation();
                if (d3.event.keyCode == consts.ENTER_KEY && !d3.event.shiftKey){
                    this.blur();
                }
            })
            .on("blur", function(d) {
                //check the name of edge is 0 to 1
                var textValue = parseFloat(this.textContent);
                if (isNaN(textValue) || !isFinite(textValue)) {
                    textValue = 0;
                } else if (textValue < 0) {
                    textValue = 0;
                } else if (textValue > 1) {
                    textValue = 1;
                }
                this.textContent = textValue;
                d.name = this.textContent;
                thisGraph.insertEdgeName(d3pathG, d);
                d3.select(this.parentElement).remove();

                if (thisGraph.state.selectedEdge == d) {
                    thisGraph.onEdgeSelected(d3pathG, d);
                }
                thisGraph.updateGraph();    //SURE?
                thisGraph.onEdgeChanged('updated', d);
            });
        // this.isChanged = true;
        // toggleAskCloseAndRefresh();
        return d3txt;
    };

    // mouseup on paths
    GraphCreator.prototype.pathMouseUp = function(d3path, d) {
        var thisGraph = this,
            state = thisGraph.state,
            consts = thisGraph.consts;
        // reset the states
        state.shiftNodeDrag = false;
        // d3path.classed(consts.connectClass, false);

        var mouseDownLink = state.mouseDownLink;
        if (!mouseDownLink) return;

        if (state.justDragged) {
            // dragged, not clicked
            state.justDragged = false;
        } else {
            // clicked, not dragged
            if (d3.event.shiftKey) {
                // shift-clicked node: edit text content of path
                var d3txt = thisGraph.changeTextOfEdge(d3.select(d3path.node().parentNode), d);
                var txtNode = d3txt.node();
                thisGraph.selectElementContents(txtNode);
                txtNode.focus();
            } else {
                if (state.selectedNode){
                    thisGraph.removeSelectFromNode();
                }
                var prevEdge = state.selectedEdge;
                if (!prevEdge || prevEdge !== d){
                    thisGraph.replaceSelectEdge(d3path, d);
                } else {
                    thisGraph.removeSelectFromEdge();
                }
            }
        }
        state.mouseDownLink = null;
        return;
    };

    // mouseup on nodes
    GraphCreator.prototype.circleMouseUp = function(d3node, d){
        var thisGraph = this,
            state = thisGraph.state,
            consts = thisGraph.consts;
        // reset the states
        state.shiftNodeDrag = false;
        d3node.classed(consts.connectClass, false);

        var mouseDownNode = state.mouseDownNode;
        if (!mouseDownNode) return;

        thisGraph.dragLine.classed("hidden", true);

        if (mouseDownNode !== d){
            // we're in a different node: create new edge for mousedown edge and add to graph
            var bEditableEdgeName = false;
            var edgeType = null;
            if (thisGraph.edgeViewMode == thisGraph.EDGE_VIEW_MODE_PATH) {
                bEditableEdgeName = true;
                edgeType = thisGraph.edgeInfPathList[0].type;
            } else if (thisGraph.edgeViewMode == thisGraph.EDGE_VIEW_MODE_SELECTED
                    && thisGraph.edgeTypeSelectedList.length == 1) {
                bEditableEdgeName = true;
                edgeType = thisGraph.edgeTypeSelectedList[0];
                if (edgeType == thisGraph.EDGE_TYPE_DEFAULT) {
                    edgeType = null;
                }
            } else {
                bEditableEdgeName = false;
                if (!isIncludeArray(thisGraph.edgeTypeSelectedList, thisGraph.EDGE_TYPE_DEFAULT)) {
                    var otherEdges = thisGraph.getEdgesBetweenSourceTarget(mouseDownNode, d);
                    var remainedEdgeTypes = [];
                    for (var i=0; i<thisGraph.edgeTypeSelectedList.length; i++) {
                        var edgeType = thisGraph.edgeTypeSelectedList[i];
                        var hasEdgeType = false;
                        for (var j=0; j<otherEdges.length; j++) {
                            if (edgeType == otherEdges[j].type) {
                                hasEdgeType = true;
                            }
                        }
                        if (!hasEdgeType) {
                            remainedEdgeTypes.push(edgeType);
                        }
                    }
                    if(remainedEdgeTypes.length > 0)
                        edgeType = remainedEdgeTypes[Math.floor(Math.random()*remainedEdgeTypes.length)];
                    else
                        edgeType = thisGraph.edgeTypeSelectedList[Math.floor(Math.random()*thisGraph.edgeTypeSelectedList.length)];
                }
            }
            var newEdge = thisGraph.createEdge(mouseDownNode, d, 0.5, edgeType, bEditableEdgeName);
            if(newEdge != null) {
                thisGraph.selectEdge(mouseDownNode.id, d.id, edgeType);
                thisGraph.onEdgeChanged('created', newEdge);
            }
        } else {
            // we're in the same node
            if (state.justDragged) {
                // dragged, not clicked
                state.justDragged = false;
            } else{
                // clicked, not dragged
                if (d3.event.shiftKey){
                    // shift-clicked node: edit text content
                    var d3txt = thisGraph.changeTextOfNode(d3node, d);
                    var txtNode = d3txt.node();
                    thisGraph.selectElementContents(txtNode);
                    txtNode.focus();
                } else{
                    if (state.selectedEdge){
                        thisGraph.removeSelectFromEdge();
                    }
                    var prevNode = state.selectedNode;

                    if (!prevNode || prevNode.id !== d.id){
                        thisGraph.replaceSelectNode(d3node, d);
                    } else{
                        thisGraph.removeSelectFromNode();
                    }
                }
            }
        }
        state.mouseDownNode = null;
        return;

    }; // end of circles mouseup

    // mousedown on main svg
    GraphCreator.prototype.svgMouseDown = function(){
        this.state.graphMouseDown = true;
    };

    // mouseup on main svg
    GraphCreator.prototype.svgMouseUp = function(){
        var thisGraph = this,
            state = thisGraph.state;
        if (state.justScaleTransGraph) {
            // dragged not clicked
            state.justScaleTransGraph = false;

        } else if (state.graphMouseDown && d3.event.shiftKey){
            // clicked not dragged from svg
            var xycoords = d3.mouse(thisGraph.svgG.node()),
                newNodeData = {id: thisGraph.idct++, title: global_consts.defaultTitle,
                               type: null, x: xycoords[0], y: xycoords[1]};
            thisGraph.nodes.push(newNodeData);
            thisGraph.updateGraph();
            thisGraph.onNodeChanged('created', newNodeData);
            // make title of text immediately editable
            var d3txt = thisGraph.changeTextOfNode(thisGraph.circles.filter(function(dval){
                return dval.id === newNodeData.id;
            }), newNodeData),
                txtNode = d3txt.node();
            thisGraph.selectElementContents(txtNode);
            txtNode.focus();
            thisGraph.selectNode(newNodeData.id);

        } else if (state.shiftNodeDrag){
            // dragged from node
            state.shiftNodeDrag = false;
            thisGraph.dragLine.classed("hidden", true);
        }
        state.graphMouseDown = false;
    };

    // keydown on main svg
    GraphCreator.prototype.svgKeyDown = function() {
        var thisGraph = this,
            state = thisGraph.state,
            consts = thisGraph.consts;
        // make sure repeated key presses don't register for each keydown
        if(state.lastKeyDown !== -1) return;

        state.lastKeyDown = d3.event.keyCode;
        var selectedNode = state.selectedNode,
            selectedEdge = state.selectedEdge;

        switch(d3.event.keyCode) {
        case consts.BACKSPACE_KEY:
        case consts.DELETE_KEY:
            var focusedTag = $(document.activeElement).prop('tagName');
            if (focusedTag == 'BODY' || focusedTag == 'SVG' || focusedTag == 'G') {
                d3.event.preventDefault();
                if (selectedNode){
                    var deletedNode = state.selectedNode;
                    thisGraph.nodes.splice(thisGraph.nodes.indexOf(selectedNode), 1);
                    thisGraph.spliceLinksForNode(selectedNode);
                    state.selectedNode = null;
                    thisGraph.updateGraph();
                    thisGraph.onNodeChanged('deleted', deletedNode);

                } else if (selectedEdge){
                    var deletedEdge = state.selectedEdge;
                    thisGraph.edges.splice(thisGraph.edges.indexOf(selectedEdge), 1);
                    state.selectedEdge = null;
                    thisGraph.updateGraph();
                    thisGraph.onEdgeChanged('deleted', deletedEdge);
                }
                thisGraph.onUnselected();
            }
            break;
        }
    };

    GraphCreator.prototype.svgKeyUp = function() {
        this.state.lastKeyDown = -1;
    };

    // call to propagate changes to graph
    GraphCreator.prototype.updateGraph = function(){
        var thisGraph = this,
            consts = thisGraph.consts,
            state = thisGraph.state;

        // update existing path
        thisGraph.paths = thisGraph.paths.data(thisGraph.edges, function(d){
            return String(d.source.id) + "+" + String(d.target.id)
                + "+" + String(d.type);
        });
        // console.log(thisGraph.paths);

        var paths = thisGraph.paths;
        var pathGroup = paths.enter().append("g");
        pathGroup.classed(consts.edgeGClass, true);

        // add new paths
        pathGroup.append("path")
            // .style('marker-end','url(#end-arrow)')
            .classed("link", true)
            .attr("d", function(d){
                return "M" + d.source.x + "," + d.source.y
                    + "L" + d.target.x + "," + d.target.y;
            })
            .on("mousedown", function(d){
                thisGraph.pathMouseDown.call(thisGraph, d3.select(this), d);
            })
            .on("mouseup", function(d){
                // state.mouseDownLink = null;
                thisGraph.pathMouseUp.call(thisGraph, d3.select(this), d);
            });
        thisGraph.updateEdgeType(pathGroup);

        //update existing paths
        if (thisGraph.edgeViewMode == thisGraph.EDGE_VIEW_MODE_PATH) {
            // show all edges in the selected type with black color and its value,
            // and just found edges are highlighted
            var allPaths = paths.select("path");
            allPaths.each(function(d) {
                d3.select(this.parentNode).classed(consts.unviewedClass, true);
            });

            var edgeTypeInPath = thisGraph.edgeInfPathList[0].type;
            var selTypePaths = paths.select("path").filter(function(d) {
                return d.type == edgeTypeInPath;
            });

            selTypePaths.each(function(d) {
                d3.select(this.parentNode).classed(consts.unviewedClass, false);
            });
            selTypePaths
                .classed(consts.selectedClass, function(d){
                    return d === state.selectedEdge;
                })
                .attr("d", function(d){
                    var filtRes = selTypePaths.filter(function(d2) {
                        if (d.source === d2.target && d.target === d2.source) {
                            return true;
                        } else {
                            return false;
                        }
                    });
                    // console.log("(update)" + d.source.id + " -> " + d.target.id);
                    // console.log(filtRes);
                    if(filtRes[0].length == 1) {    //bi-direct
                        d.bilateral = true;
                        var x = d.source.x - d.target.x;
                        var dx = Math.abs(x);
                        var y = d.source.y - d.target.y;
                        var dy = Math.abs(y);
                        var rad = Math.atan2(y, x);
                        var cos = Math.cos(rad);
                        var sin = Math.sin(rad);
                        return "M" + (d.source.x - 10*sin) + "," + (d.source.y + 10*cos)
                            + "L" + (d.target.x - 10*sin) + "," + (d.target.y + 10*cos);
                    } else {    //single-direct
                        d.bilateral = false;
                        return "M" + d.source.x + "," + d.source.y + "L" + d.target.x + "," + d.target.y;
                    }
                });

            paths.each(function(d) {
                d3.select(this).selectAll("text").remove();
                // if (isIncludeArray(thisGraph.edgeInfPathList, d))
                if (d.type == edgeTypeInPath)
                    thisGraph.insertEdgeName(d3.select(this), d);
            });

        } else if (thisGraph.edgeViewMode == thisGraph.EDGE_VIEW_MODE_SELECTED
                && thisGraph.edgeTypeSelectedList.length == 1) {
            // show all edges in the selected type with black color and its value
            var allPaths = paths.select("path");
            // allPaths.classed(consts.unviewedClass, true);
            // d3.select(allPaths.parentNode).classed(consts.unviewedClass, true);
            allPaths.each(function(d) {
                d3.select(this.parentNode).classed(consts.unviewedClass, true);
            });

            var selType = null;
            if (thisGraph.edgeTypeSelectedList[0] != thisGraph.EDGE_TYPE_DEFAULT)
                selType = thisGraph.edgeTypeSelectedList[0];
            var selTypePaths = paths.select("path").filter(function(d) {
                return d.type == selType;
            });
            // console.log(selTypePaths);

            // d3.select(selTypePaths.node().parentNode).classed(consts.unviewedClass, false);
            selTypePaths.each(function(d) {
                d3.select(this.parentNode).classed(consts.unviewedClass, false);
            });
            // paths.select("path")
            selTypePaths//.classed(consts.unviewedClass, false)
                .classed(consts.selectedClass, function(d){
                    return d === state.selectedEdge;
                })
                .attr("d", function(d){
                    var filtRes = selTypePaths.filter(function(d2) {
                        if (d.source === d2.target && d.target === d2.source) {
                            return true;
                        } else {
                            return false;
                        }
                    });
                    // console.log("(update)" + d.source.id + " -> " + d.target.id);
                    // console.log(filtRes);
                    if(filtRes[0].length == 1) {    //bi-direct
                        d.bilateral = true;
                        var x = d.source.x - d.target.x;
                        var dx = Math.abs(x);
                        var y = d.source.y - d.target.y;
                        var dy = Math.abs(y);
                        var rad = Math.atan2(y, x);
                        var cos = Math.cos(rad);
                        var sin = Math.sin(rad);
                        return "M" + (d.source.x - 10*sin) + "," + (d.source.y + 10*cos)
                            + "L" + (d.target.x - 10*sin) + "," + (d.target.y + 10*cos);
                    } else {    //single-direct
                        d.bilateral = false;
                        return "M" + d.source.x + "," + d.source.y + "L" + d.target.x + "," + d.target.y;
                    }
                });

            paths.each(function(d) {
                d3.select(this).selectAll("text").remove();
                // if (d.type == null && isIncludeArray(thisGraph.edgeTypeSelectedList, thisGraph.EDGE_TYPE_DEFAULT)
                //         || isIncludeArray(thisGraph.edgeTypeSelectedList, d.type)) {
                if (d.type == selType) {
                    thisGraph.insertEdgeName(d3.select(this), d);
                }
            });
        } else {
            // show all edge in the selected type with only its color
            var allPaths = paths.select("path");
            allPaths.each(function(d) {
                d3.select(this.parentNode).classed(consts.unviewedClass, true);
            });

            var selTypePaths = paths.select("path").filter(function(d) {
                if (d.type == null) {
                    return isIncludeArray(thisGraph.edgeTypeSelectedList, thisGraph.EDGE_TYPE_DEFAULT);
                } else {
                    return isIncludeArray(thisGraph.edgeTypeSelectedList, d.type)
                }
            });

            selTypePaths.each(function(d) {
                d3.select(this.parentNode).classed(consts.unviewedClass, false);
            });
            // paths.select("path")
            selTypePaths.classed(consts.selectedClass, function(d){
                    return d === state.selectedEdge;
                })
                .attr("d", function(d){
                    //get all edges between two nodes.
                    var filtRes = selTypePaths.filter(function(d2) {
                        if ((d.source === d2.source && d.target === d2.target)
                                || (d.source === d2.target && d.target === d2.source)) {
                            return true;
                        } else {
                            return false;
                        }
                    });
                    // console.log("(update)" + d.source.id + " -> " + d.target.id);
                    // console.log(filtRes);
                    var edgeNum = filtRes[0].length;    //include itself(d)
                    if (edgeNum > 1) {  //if edgeNum is more than 1
                        var edgeCnt = -1;   //find its count
                        var edgeCtList = [];
                        for (var i=0; i<filtRes[0].length; i++) {
                            var path = filtRes[0][i];
                            edgeCtList.push(path.__data__.ct);
                        }
                        edgeCtList.sort();
                        for (var i=0; i<edgeCtList.length; i++) {
                            if (d.ct == edgeCtList[i]) {
                                edgeCnt = i;
                                break;
                            }
                        }

                        var bSourceLeftUp = true;
                        if (d.source.x == d.target.x) {
                            if (d.source.y > d.target.y) {
                                bSourceLeftUp = false;
                            }
                        } else if (d.source.x > d.target.x) {
                            bSourceLeftUp = false;
                        }
                        var x = d.source.x - d.target.x;
                        var dx = Math.abs(x);
                        var y = d.source.y - d.target.y;
                        var dy = Math.abs(y);
                        var rad = Math.atan2(y, x);
                        var cos = Math.cos(rad);
                        var sin = Math.sin(rad);

                        var edgeIntervalStart;
                        var edgeInterval;
                        if (edgeNum in thisGraph.EDGE_INTERVAL) {
                            edgeIntervalStart = thisGraph.EDGE_INTERVAL_START[edgeNum];
                            edgeInterval = thisGraph.EDGE_INTERVAL[edgeNum];
                        } else {
                            edgeIntervalStart = -thisGraph.EDGE_INTERVAL_MAX_WIDTH / 2;
                            edgeInterval = thisGraph.EDGE_INTERVAL_MAX_WIDTH / (edgeNum-1);
                        }
                        var interval = edgeIntervalStart + edgeInterval*edgeCnt;

                        if (bSourceLeftUp) {
                            return "M" + (d.source.x + interval * sin) + "," + (d.source.y - interval * cos)
                                + "L" + (d.target.x + interval * sin) + "," + (d.target.y - interval * cos);
                        } else {
                            return "M" + (d.source.x - interval * sin) + "," + (d.source.y + interval * cos)
                                + "L" + (d.target.x - interval * sin) + "," + (d.target.y + interval * cos);
                        }
                    } else {    //single-direct
                        d.bilateral = false;
                        return "M" + d.source.x + "," + d.source.y + "L" + d.target.x + "," + d.target.y;
                    }
                });

            paths.each(function(d) {
                d3.select(this).selectAll("text").remove();
                thisGraph.insertEdgeName(d3.select(this), d);
                // if (d.type == selType) {
                //
                // }
            });
        }

        thisGraph.paths.exit().remove();


        // update existing nodes
        thisGraph.circles = thisGraph.circles.data(thisGraph.nodes, function(d){ return d.id;});
        thisGraph.circles.attr("transform", function(d){return "translate(" + d.x + "," + d.y + ")";});

        // add new nodes
        var newGs= thisGraph.circles.enter()
                    .append("g");
        thisGraph.updateNodeType(newGs);
        newGs.classed(consts.circleGClass, true)
            .attr("transform", function(d){return "translate(" + d.x + "," + d.y + ")";})
            .on("mouseover", function(d){
                if (state.shiftNodeDrag){
                    d3.select(this).classed(consts.connectClass, true);
                }
            })
            .on("mouseout", function(d){
                d3.select(this).classed(consts.connectClass, false);
            })
            .on("mousedown", function(d){
                thisGraph.circleMouseDown.call(thisGraph, d3.select(this), d);
            })
            .on("mouseup", function(d){
                thisGraph.circleMouseUp.call(thisGraph, d3.select(this), d);
            })
            .call(thisGraph.drag);

        newGs.append("circle")
            .attr("r", String(consts.nodeRadius));

        newGs.each(function(d){
            thisGraph.insertTitleLinebreaks(d3.select(this), d.title);
        });

        // remove old nodes
        thisGraph.circles.exit().remove();

};

    GraphCreator.prototype.updateNodeType = function(gs){
        var thisGraph = this;
        // if (gs == undefined || gs == null)
        //     gs = thisGraph.circles;
        //add color
        gs.each(function(d) {
            //remove color
            $(this).removeClass(function(index, className) {
                return (className.match (/(^|\s)type-color-\S+/g) || []).join(' ');
            });
            //add color
            if (d.type != undefined && d.type != null && /\S/.test(d.type)) {
               // this.classed(thisGraph.consts.typeColorHead + d.type, true);
                if (d.type in thisGraph.nodeTypes) {
                    $(this).addClass(thisGraph.consts.typeColorHead + thisGraph.nodeTypes[d.type]['color']);
                } else {    // if existed type is deleted
                    d.type = null;
                }
            } else {
                d.type = null;
            }
        });
        // if (type != undefin/this.consts.typeColorHead + type, true);
        // this.isChanged = true;
        // toggleAskCloseAndRefresh();
    };

    GraphCreator.prototype.updateEdges = function () {
        //pass
    };

    GraphCreator.prototype.updateEdgeType = function(gs){
        var thisGraph = this;
        gs.each(function(d) {
            //remove color
            $(this).removeClass(function(index, className) {
                return (className.match (/(^|\s)type-color-\S+/g) || []).join(' ');
            });
            //add color
            if (d.type != undefined && d.type != null && /\S/.test(d.type)) {
                if (d.type in thisGraph.edgeTypes) {
                    $(this).addClass(thisGraph.consts.typeColorHead + thisGraph.edgeTypes[d.type]['color']);
                    // $(this).children("path").addClass("default-marker");

                    /* edge head */
                    // $(this).children(".link").css('marker-end', 'url("#end-arrow")');
                    // $(this).children(".link").hover(function () {
                    //     $(this).css('marker-end', 'url("#end-arrow-hover")');
                    // }, function () {
                    //     $(this).css('marker-end', 'url("#end-arrow")');
                    // });
                } else {    // if existed type is deleted
                    d.type = null;
                }
            } else {
                d.type = null;
            }
        });
        // this.isChanged = true;
        // toggleAskCloseAndRefresh();
        // if (type != undefin/this.consts.typeColorHead + type, true);
    };

    GraphCreator.prototype.zoomed = function(){
        this.state.justScaleTransGraph = true;
        d3.select("." + this.consts.graphClass)
            .attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");

    };

    GraphCreator.prototype.setZoom = function(dbl) {
        var thisGraph = this;

        /* Set zoom object to auto scale*/
        var dragSvg = d3.behavior.zoom()
            .on("zoom", function(){
                if (d3.event.sourceEvent.shiftKey){
                    // TODO  the internal d3 state is still changing
                    return false;
                } else{

                    thisGraph.zoomed.call(thisGraph);
                }
                return true;
            })
            .on("zoomstart", function(){
                var ael = d3.select("#" + thisGraph.consts.activeEditId).node();
                if (ael){
                    ael.blur();
                }
                if (!d3.event.sourceEvent.shiftKey) d3.select('body').style("cursor", "move");
            })
            .on("zoomend", function(){
                d3.select('body').style("cursor", "auto");
            });
        svg.call(dragSvg).on("dblclick.zoom", null);

        if(dbl == true) {
            d3.select("." + this.consts.graphClass)
                .attr("transform", "translate(" + [0, 0] + ") scale(" + 1 + ")");
        }

        /* Set auto scale */
        var top = d3.select("." + this.consts.graphClass).node().getBoundingClientRect().top;
        var bottom =  d3.select("." + this.consts.graphClass).node().getBoundingClientRect().bottom;
        var left = d3.select("." + this.consts.graphClass).node().getBoundingClientRect().left;
        var right = d3.select("." + this.consts.graphClass).node().getBoundingClientRect().right;
        var height = d3.select("." + this.consts.graphClass).node().getBoundingClientRect().height;
        var width = d3.select("." + this.consts.graphClass).node().getBoundingClientRect().width;
        var scale = 1;
        // var windowWidth = 1680, windowHeight = 900;
        if (height >= $(window).height() || width >= ($(window).width()-240)) {
            if(height >= $(window).height() && width <= ($(window).width()-240))
                scale = $(window).height()/height;
            else if(height <= $(window).height() && width >= ($(window).width()-240))
                scale = ($(window).width()-240)/width;
            else
                scale = (($(window).height()/height >= ($(window).width()-240)/width)? ($(window).width()-240)/width : $(window).height()/height);
        }
        scale *= 0.8;

        this.state.justScaleTransGraph = true;
        // var translatedWidth = ($(window).width() - ($(window).width() * 0.5)) - ((left + right) * scale /2);
        // var translatedHeight = $(window).height() - $(window).width() * 0.3 - ((top + bottom) * scale /2);
        var translatedWidth = (($(window).width()-240) * 0.5) - ((left + right) * 0.5 * scale);
        var translatedHeight = ($(window).height() * 0.5) - ((top + bottom) * 0.5 * scale);
        var offset = ($(window).width()-240) * 0.1;
        translatedWidth += offset;

        d3.select("." + this.consts.graphClass)
            .attr("transform", "translate(" + [translatedWidth, translatedHeight] + ") scale(" + scale + ")");
        dragSvg.scale(scale);
        dragSvg.translate([translatedWidth, translatedHeight]);

    };

    GraphCreator.prototype.focus = function(focus) {
        this.state.graphFocus = focus;
    };

    GraphCreator.prototype.updateWindow = function(svg){
        var docEl = document.documentElement,
            divEl = document.getElementsByTagName('graph')[0];
        // var winWidth = window.innerWidth || docEl.clientWidth || divEl.clientWidth;
        var winWidth = docEl.clientWidth || divEl.clientWidth;
        // var winHeight = window.innerHeight|| docEl.clientHeight|| divEl.clientHeight;
        var winHeight = docEl.clientHeight|| divEl.clientHeight;
        svg.attr("width", winWidth - global_consts.graphSvgStartX)
            .attr("height", winHeight - global_consts.graphSvgStartY);
    };

    GraphCreator.prototype.setCallbacks
            = function(onNodeSelected, onEdgeSelected, onUnselected, onNodeChanged, onEdgeChanged) {
        this.onNodeSelected = onNodeSelected;
        this.onEdgeSelected = onEdgeSelected;
        this.onUnselected = onUnselected;
        this.onNodeChanged = onNodeChanged;
        this.onEdgeChanged = onEdgeChanged;
    };

    GraphCreator.prototype.changeNodeTitle = function(d3node, title) {
        d3node.selectAll("text").remove();
        this.insertTitleLinebreaks(d3node, title);
        this.isChanged = true;
        toggleAskCloseAndRefresh();
    }

    GraphCreator.prototype.changeEdgeName = function(d3pathG, edgeData) {
        d3pathG.selectAll("text").remove();
        this.insertEdgeName(d3pathG, edgeData);
        this.isChanged = true;
        toggleAskCloseAndRefresh();
    }

    GraphCreator.prototype.createNode = function(updating=true) {
        var thisGraph = this;

        var gGraph = thisGraph.svg.select("g.graph");
        var transform = gGraph.attr("transform");
        var tX=0, tY=0, scale=1;
        if (transform != null) {
            var trs = transform.split(' ');
            for(var i=0; i<trs.length; i++) {
                if (trs[i].startsWith('translate')) {
                    var xystr = trs[i].substring(10, trs[i].length-1);
                    var xyar = xystr.split(',');
                    tX = parseFloat(xyar[0]);
                    tY = parseFloat(xyar[1]);
                } else if (trs[i].startsWith('scale')) {
                    scale = parseFloat(trs[i].substring(6, trs[i].length-1));
                }
            }
        }
        var pX=(parseInt(thisGraph.svg.attr('width'))/2-tX)/scale,
            pY=(parseInt(thisGraph.svg.attr('height'))/2-tY)/scale;
        var newNodeData = {id: thisGraph.idct++, title: global_consts.defaultTitle,
                           type: null, x: pX, y: pY};
        thisGraph.nodes.push(newNodeData);

        if (updating==undefined || updating==null)
            updating = true;
        if (updating) thisGraph.updateGraph();

        // var d3Node = thisGraph.circles.filter(function(cd) {
        //     return cd.id === newNodeData.id;
        // });
        // thisGraph.replaceSelectNode(d3Node, newNodeData);
        this.isChanged = true;
        toggleAskCloseAndRefresh();
        return newNodeData;
    };

    GraphCreator.prototype.insertNode = function(newNodeData) {
        var thisGraph = this;
        newNodeData.id = thisGraph.idct++;
        thisGraph.nodes.push(newNodeData);
        this.isChanged = true;
        toggleAskCloseAndRefresh();
        return newNodeData;
    };

    GraphCreator.prototype.createEdge = function(sourceNode, targetNode, name, type, editable=false) {
        var thisGraph = this;
        var newEdge = {source: sourceNode, target: targetNode, name: name, type: type,
            bilateral: false, ct: thisGraph.edgect};
        thisGraph.edgect++;

        var filtRes = thisGraph.paths.filter(function(d){
            return d.source === newEdge.source && d.target === newEdge.target
                && d.type == newEdge.type;
        });
        if (!filtRes[0].length) {
            thisGraph.edges.push(newEdge);
            thisGraph.updateGraph();
            thisGraph.updateEdgeType(this.paths);
            thisGraph.updateGraph();

            if (editable) {
                // make name of text immediately editable
                var d3txt = thisGraph.changeTextOfEdge(thisGraph.paths.filter(function(dval) {
                    return dval.source === newEdge.source && dval.target === newEdge.target;
                }), newEdge),
                    txtEdge = d3txt.node();
                thisGraph.selectElementContents(txtEdge);
                txtEdge.focus();
            }


            this.isChanged = true;
            toggleAskCloseAndRefresh();
            return newEdge;
        }
        return null;
    };

    GraphCreator.prototype.selectNode = function(id) {
        var thisGraph = this;
        var nodeData = thisGraph.getNodeById(id);
        if (nodeData != null) {
            var d3Node = thisGraph.circles.filter(function(cd) {
                return cd.id === nodeData.id;
            });
            if (d3Node == null || d3Node.length < 0) return false;

            if (thisGraph.state.selectedEdge) {
                thisGraph.removeSelectFromEdge();
            }
            thisGraph.replaceSelectNode(d3Node, nodeData);
            $('animate').remove(); // Remove other animation
            d3Node.append("animate")  // Add Blink animation to  new Node
                .attr("id", "anim" + id)
                .attr("attributeType", "css")
                .attr("attributeName", "opacity")
                .attr("from", "1")
                .attr("to", "0")
                .attr("dur", "0.75s")
                .attr("begin", "0s")
                .attr("repeatCount", "indefinite");
            setTimeout(function () {
                $('#anim' + id).remove();
            }, 2250);
            return true;
        } else {
            return false;
        }
    }

    GraphCreator.prototype.selectEdge = function(sourceId, targetId, type) {
        var thisGraph = this;
        var edgeData = thisGraph.getEdge(sourceId, targetId, type);
        if (edgeData != null) {
            var d3PathG = thisGraph.paths.filter(function(d) {
                return edgeData == d;
            });
            if (d3PathG == null || d3PathG.length < 0) return false;

            if (thisGraph.state.selectedNode) {
                thisGraph.removeSelectFromNode();
            }
            thisGraph.replaceSelectEdge(d3PathG.selectAll("path"), edgeData);
            $('animate').remove(); // Remove other animation
            d3PathG.selectAll("path").append("animate")  // Add blink animation to  new Edge
                .attr("id", "anim" + sourceId + targetId + type)
                .attr("attributeType", "css")
                .attr("attributeName", "opacity")
                .attr("from", "1")
                .attr("to", "0")
                .attr("dur", "0.75s")
                .attr("begin", "0s")
                .attr("repeatCount", "indefinite");
            setTimeout(function () {
                $('#anim' + sourceId + targetId + type).remove();
            }, 2250);

            console.log(type);

            return true;
        } else {
            return false;
        }
    }

    GraphCreator.prototype.unselect = function() {
        if (this.state.selectedNode) {
            this.removeSelectFromNode();
            return true;
        } else if (this.state.selectedEdge) {
            this.removeSelectFromEdge();
            return true;
        } else {
            return false;
        }
    };

    GraphCreator.prototype.getNodeById = function(id) {
        for (var i=0; i<this.nodes.length; i++) {
            if (this.nodes[i].id == id) return this.nodes[i];
        }
        return null;
    };

    GraphCreator.prototype.getEdgeByCt = function(ct) {
        for (var i=0; i<this.edges.length; i++) {
            if (this.edges[i].ct == ct) return this.edges[i];
        }
        return null;
    };

    GraphCreator.prototype.getEdge = function(sourceId, targetId, edgeTypeId) {
        var source = this.getNodeById(sourceId),
            target = this.getNodeById(targetId);
        if (source == null || target == null) return null;
        for (var i=0; i<this.edges.length; i++) {
            var edge = this.edges[i];
            if (edge.source == source && edge.target == target
                && edge.type == edgeTypeId) return edge;
            else if (edge.source == source && edge.target == target
                && edge.type == null && isNaN(edgeTypeId)) return edge;
        }
        return null;
    };

    GraphCreator.prototype.getEdgesBetweenTwoNodes = function(nodeId1, nodeId2) {
        var node1 = this.getNodeById(nodeId1),
            node2 = this.getNodeById(nodeId2);
        if (node1 == null || node2 == null) return [];
        var edgeList = [];
        for (var i=0; i<this.edges.length; i++) {
            var edge = this.edges[i];
            if (edge.source == node1 && edge.target == node2) {
                edgeList.push(edge);
            } else if (edge.source == node2 && edge.target == node1) {
                edgeList.push(edge);
            }
        }
        return edgeList;
    };

    GraphCreator.prototype.getEdgesBetweenSourceTarget = function(source, target) {
        if (source == null || target == null) return [];
        var edgeList = [];
        for (var i=0; i<this.edges.length; i++) {
            var edge = this.edges[i];
            if (edge.source == source && edge.target == target) {
                edgeList.push(edge);
            }
        }
        return edgeList;
    };

    GraphCreator.prototype.setEdgeViewMode = function(mode, selectedList=null) {
        if(selectedList == undefined || selectedList == null)
            selectedList = [];

        var thisGraph = this;
        switch (mode) {
            case thisGraph.EDGE_VIEW_MODE_ALL:
                thisGraph.edgeViewMode = thisGraph.EDGE_VIEW_MODE_SELECTED;
                thisGraph.edgeTypeSelectedList = [];
                thisGraph.edgeTypeSelectedList.push(thisGraph.EDGE_TYPE_DEFAULT);
                for (var edgeType in thisGraph.edgeTypes) {
                    thisGraph.edgeTypeSelectedList.push(edgeType);
                }
                thisGraph.edgeInfPathList = [];
                thisGraph.highlightPath();
                break;
            case thisGraph.EDGE_VIEW_MODE_SELECTED:
                thisGraph.edgeViewMode = mode;
                thisGraph.edgeTypeSelectedList = selectedList;  //edge type list
                thisGraph.edgeInfPathList = [];
                thisGraph.highlightPath();
                break;
            case thisGraph.EDGE_VIEW_MODE_PATH:
                thisGraph.edgeViewMode = mode;
                thisGraph.edgeTypeSelectedList = [];
                thisGraph.edgeInfPathList = selectedList;   //edge list in path
                thisGraph.highlightPath(selectedList);
                break;
        }
        thisGraph.unselect();
        thisGraph.updateGraph();
        thisGraph.updateEdgeType(this.paths);
    };

    GraphCreator.prototype.highlightPath = function(edgeList) {
        var thisGraph = this,
            consts = thisGraph.consts;
        var circles = thisGraph.circles;
        var paths = thisGraph.paths;
        if (!edgeList) edgeList = [];

        var allPaths = paths.select("path");
        allPaths.each(function(d) {
            if (isIncludeArray(edgeList, d))
                d3.select(this.parentNode).classed(consts.hightlightClass, true);
            else d3.select(this.parentNode).classed(consts.hightlightClass, false);
        });

        if (edgeList.length >= 1) {
            var startNode = edgeList[0].source;
            var endNode = edgeList[edgeList.length - 1].target;
            circles.each(function (d) {
                if (d == startNode || d == endNode)
                    d3.select(this).classed(consts.hightlightClass, true);
                else d3.select(this).classed(consts.hightlightClass, false);
            });
        } else {
            circles.each(function (d) {
                d3.select(this).classed(consts.hightlightClass, false);
            });
        }
    };

    GraphCreator.prototype.deleteNode = function() {
        var thisGraph = this,
            state = thisGraph.state;
        if (state.selectedNode) {
            thisGraph.nodes.splice(thisGraph.nodes.indexOf(state.selectedNode), 1);
            thisGraph.spliceLinksForNode(state.selectedNode);
            state.selectedNode = null;
            thisGraph.updateGraph();
        }
        this.isChanged = true;
        toggleAskCloseAndRefresh();
    };

    GraphCreator.prototype.deleteEdge = function() {
        var thisGraph = this,
            state = thisGraph.state;
        if (state.selectedEdge) {
            thisGraph.edges.splice(thisGraph.edges.indexOf(state.selectedEdge), 1);
            state.selectedEdge = null;
            thisGraph.updateGraph();
        }
        this.isChanged = true;
        toggleAskCloseAndRefresh();
    };

    GraphCreator.prototype.setNodeTypes = function(types) {
        this.nodeTypes = types;
        this.updateNodeType(this.circles);
        this.isChanged = true;
        toggleAskCloseAndRefresh();
    };

    GraphCreator.prototype.setEdgeTypes = function(types) {
        this.edgeTypes = types;
        this.updateEdgeType(this.paths);
        this.isChanged = true;
        toggleAskCloseAndRefresh();
    };

    GraphCreator.prototype.resetTransform = function() {
        this.svgG.attr('transform', '');
        console.log("resetTransform");
    };

    /**** MAIN ****/

    // warn the user when leaving
    // window.onbeforeunload = function(){
    //     return "Make sure to save your graph locally before leaving :-)";
    // };

    var docEl = document.documentElement,
        divEl = document.getElementsByTagName('graph')[0];

    // var winWidth = window.innerWidth || docEl.clientWidth || divEl.clientWidth,
    //     winHeight =  window.innerHeight|| docEl.clientHeight|| divEl.clientHeight;
    var winWidth = docEl.clientWidth || divEl.clientWidth,
        winHeight =  docEl.clientHeight|| divEl.clientHeight;

    var xLoc = winWidth/2 - 125,
        yLoc = 150;

    // initial node data
    var nodes = [{title: "Node 0", id: 0, x: xLoc, y: yLoc, type: 0},
                 {title: "Node 1", id: 1, x: xLoc, y: yLoc + 300, type: 1},
                 {title: "Node 2", id: 2, x: xLoc+200, y: yLoc + 150, type: null}];
    // var nodes = [{title: "Node 0", id: 0, x: xLoc, y: yLoc, type: null},
    //          {title: "Node 1", id: 1, x: xLoc, y: yLoc + 300, type: null},
    //          {title: "Node 2", id: 2, x: xLoc+200, y: yLoc + 150, type: null}];
    var edges = [{source: nodes[2], target: nodes[0], name: 1},
                 {source: nodes[0], target: nodes[2], name: 0.12},
                 {source: nodes[1], target: nodes[2], name: 0.69},
                 {source: nodes[0], target: nodes[1], name: 0.44}];
    var types = {
        // "A": "red",
        // "B": "yellow",
        // "C": "blue"
        0: {name: "A", color: "red"},
        1: {name: "B", color: "yellow"},
        2: {name: "C", color: "blue"}
    };

    /** MAIN SVG **/
    var svg = d3.select(global_settings.appendElSpec).append("svg")
                .attr("width", winWidth - global_consts.graphSvgStartX)
                .attr("height", winHeight - global_consts.graphSvgStartY);
    // networkGraph = new GraphCreator(svg, nodes, edges, types);
    // networkGraph.setIdCt(3);
    networkGraph = new GraphCreator(svg, [], [], {}, {});
    networkGraph.updateGraph();

})(window.d3, window.saveAs, window.Blob);



/**util functions**/
function isIncludeArray (arr, data) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == data) return true;
    }
    return false;
}

function toggleAskCloseAndRefresh() {
    if(networkGraph.isChanged == false) {
        window.onbeforeunload = null;
        // console.log("networkGraph.isChanged == false");
    } else {
        // console.log("networkGraph.isChanged == true");
        window.onbeforeunload = function(){
            return "Make sure to save your graph locally before leaving :-)";
        };
    }
}