var user = null;
var nowGraphInfo = null;
var updateNodeType = false; // When node type is changed, this value set true.
var updateEdgeType = false; // When edge type is changed, this value set true.
var memento = new Memento();

var typeColors = [
    'red', 'pink', 'purple', 'deep-purple', 'indigo', 'blue',
    'light-blue', 'cyan', 'teal', 'green', 'light-green',
    'lime', 'yellow', 'amber', 'orange', 'deep-orange',
    'brown','grey', 'blue-grey'
];

var nodeTypes = {
    0: {name: "A", color: "red"},
    1: {name: "B", color: "blue"},
    2: {name: "C", color: "yellow"}
};
var nodeTypeCnt = 3;

var nodeConfidences = {
    0: {
        1: 0.2, 2: 0.3
    }, 1: {
        0: 0.6, 2: 0.1
    }, 2: {
        0: 0.5, 1: 0.7
    }
};

var edgeTypes = {
    0: {name: "P", color: "indigo"},
    1: {name: "Q", color: "teal"}
};
var edgeTypeCnt = 0;
var viewedEdgeTypes = [networkGraph.EDGE_TYPE_DEFAULT, 0, 1];

//remove defaults
nodeTypes = {};
nodeTypeCnt = 0;
nodeConfidences = {};
edgeTypes = {};
edgeTypeCnt = 0;
viewedEdgeTypes = [networkGraph.EDGE_TYPE_DEFAULT];



function updateNodeTypes() {
    // if(Object.keys(nodeTypes).length == 0) { // It is possible select node type only When node type exists.
    //     $('#subMenuNodeTypeDropdown').remove();
    // }
    // else {
    //     $('#subMenuNodeTypeDropdown').remove();
    //     $('#subMenuNode > .btn-group').append("<ul id=\"subMenuNodeTypeDropdown\" class=\"dropdown-menu\">");
    //     $('#subMenuNodeTypeDropdown').empty();
    // }
    $('#subMenuNodeTypeDropdown').empty();
    $('#subMenuNodeTypeDropdown').append("<li><a>"
        + nodeTypeToSubMenuHtml(null) + "</a></li>");
    for (var tid in nodeTypes) {
        $('#subMenuNodeTypeDropdown').append("<li><a>"
            + nodeTypeToSubMenuHtml(tid) + "</a></li>");
    }
    $('#subMenuNodeTypeDropdown > li > a').off('click').unbind('click').click(function() {
        var selItem = $(this);
        $('#subMenuNodeType').removeClass('unselected').html(selItem.html());
    });

    networkGraph.setNodeTypes(nodeTypes);
    updateNodeList();
    networkGraph.updateGraph();
}
function updateNodeList(event, updatedData) {  //if updatedData is null, all data update
    if (event == undefined || updatedData == undefined)
        event = updatedData = null;

    // For submenu
    // $('.subMenuEdgeNodeDropdown').empty();
    // for (var i=0; i<networkGraph.nodes.length; i++) {
    //     var nodeData = networkGraph.nodes[i];
    //     var nodeInfoHtml = "<li><a>" + nodeDataToSubMenuHtml(nodeData) + "</a></li>";
    //     $('.subMenuEdgeNodeDropdown').append(nodeInfoHtml);
    // }
    // $('#subMenuEdgeSourceDropdown > li > a').off('click').unbind('click').click(function() {
    //     var selItem = $(this);
    //     $('#subMenuEdgeSource').removeClass('unselected').html(selItem.html());
    // });
    // $('#subMenuEdgeTargetDropdown > li > a').off('click').unbind('click').click(function() {
    //     var selItem = $(this);
    //     $('#subMenuEdgeTarget').removeClass('unselected').html(selItem.html());
    // });
    // if (selectedEdge != null) {
    //     if (selectedEdge.edgeData.source == updatedData) {
    //         $('#subMenuEdgeSourceDropdown > li > a').each(function (idx, elem) {
    //             if ($(this).find('.nodeName').data('nodeid') == updatedData.id) {
    //                 $('#subMenuEdgeSource').html($(this).html());
    //             }
    //         });
    //     } else if (selectedEdge.edgeData.target == updatedData) {
    //         $('#subMenuEdgeTargetDropdown > li > a').each(function (idx, elem) {
    //             if ($(this).find('.nodeName').data('nodeid') == updatedData.id) {
    //                 $('#subMenuEdgeTarget').html($(this).html());
    //             }
    //         });
    //     }
    // }

    // For new edge dialog
    $('.newEdgeDlgNodeDropdown').empty();
    for (var i=0; i<networkGraph.nodes.length; i++) {
        var nodeData = networkGraph.nodes[i];
        var nodeInfoHtml = "<li><a>" + nodeDataToSubMenuHtml(nodeData) + "</a></li>";
        $('.newEdgeDlgNodeDropdown').append(nodeInfoHtml);
    }
    $('#newEdgeDlgSourceDropdown > li > a').off('click').unbind('click').click(function() {
        var selItem = $(this);
        $('#newEdgeDlgSource').removeClass('unselected').html(selItem.html());
    });
    $('#newEdgeDlgTargetDropdown > li > a').off('click').unbind('click').click(function() {
        var selItem = $(this);
        $('#newEdgeDlgTarget').removeClass('unselected').html(selItem.html());
    });

    // For side menu
    var newListItems = null;
    if (updatedData == null) {
        $('#sideMenuNodeList').empty();
        for (var i=0; i<networkGraph.nodes.length; i++) {
            nodeData = networkGraph.nodes[i];
            var nodeInfoHtml = "<li><a data-nodeid='" + nodeData.id
                + "'><span class='nodeName'>" + nodeData.title + "</span></a></li>";
            $('#sideMenuNodeList').append(nodeInfoHtml);
        }
        newListItems = $('#sideMenuNodeList > li > a');
    } else {
        if (event == 'created') {
            var nodeInfoHtml = "<li><a data-nodeid='" + updatedData.id
                + "'><span class='nodeName'>" + updatedData.title + "</span></a></li>";
            $('#sideMenuNodeList').append(nodeInfoHtml);
            newListItems = $('#sideMenuNodeList > li > a:last');
        } else if (event == 'updated') {
            $('#sideMenuNodeList > li > a').each(function(idx, elem) {
                if (updatedData.id == $(this).data('nodeid')) {
                    $(this).find('.nodeName').text(updatedData.title);
                }
            });

            $('#sideMenuEdgeList > li > a .edge-source, ' +
                '#sideMenuEdgeList > li > a .edge-target').each(function(idx, elem) {
                if (updatedData.id == $(this).data('nodeid')) {
                    $(this).text(updatedData.title);
                }
            });
        } else if (event == 'deleted') {
            var deletedNodeElem = null;
            $('#sideMenuNodeList > li > a').each(function(idx, elem) {
                if (updatedData.id == $(this).data('nodeid')) {
                    deletedNodeElem = $(this);
                }
            });
            if (deletedNodeElem != null) deletedNodeElem.remove();

            var deletedEdgeElems = [];
            $('#sideMenuEdgeList > li > a').each(function(idx, elem) {
                if (updatedData.id == $(this).find('.edge-source').data('nodeid') ||
                        updatedData.id == $(this).find('.edge-target').data('nodeid')) {
                    deletedEdgeElems.push(this);
                }
            });
            for (var i=deletedEdgeElems.length-1; i>=0; i--) {
                deletedEdgeElems[i].remove();
            }
        }
    }
    if (newListItems != null) {
        newListItems.off('click').unbind('click').click(function() {
            var selItem = $(this);
            if (selItem.hasClass('active')) {
                selItem.removeClass('active');
                networkGraph.unselect();
            } else {
                $('#sideMenuNodeList > li > a, #sideMenuEdgeList > li > a').removeClass('active');
                selItem.addClass('active');
                networkGraph.selectNode(selItem.data('nodeid'));
            }
        });
    }
}

function updateEdgeTypes() {
    // if(Object.keys(edgeTypes).length == 0 ) { // It is possible select edge type only When edge type exists.
    //     $('#subMenuEdge > .btn-group > ul').remove();
    // } else {
    //     $('#subMenuEdge > .btn-group > ul').remove();
    //     $('#subMenuEdge > .btn-group').append("<ul id=\"subMenuEdgeTypeDropdown\" class=\"dropdown-menu\">");
    //     $('#subMenuEdge > .btn-group > ul').empty();
    // }

    $('#subMenuEdgeTypeDropdown').empty();
    $('#subMenuEdgeTypeDropdown').append("<li><a>"
        + edgeTypeToSubMenuHtml(null) + "</a></li>");

    for (var tid in edgeTypes) {
        $('#subMenuEdgeTypeDropdown').append("<li><a>"
            + edgeTypeToSubMenuHtml(tid) + "</a></li>");
    }
    $('#subMenuEdgeTypeDropdown > li > a').off('click').unbind('click').click(function() {
        var selItem = $(this);
        $('#subMenuEdgeType').removeClass('unselected').html(selItem.html());
    });

    $('#newEdgeDlgTypeDropdown').empty();
    $('#newEdgeDlgTypeDropdown').append("<li><a>"
        + edgeTypeToSubMenuHtml(null) + "</a></li>");

    for (var tid in edgeTypes) {
        $('#newEdgeDlgTypeDropdown').append("<li><a>"
            + edgeTypeToSubMenuHtml(tid) + "</a></li>");
    }
    $('#newEdgeDlgTypeDropdown > li > a').off('click').unbind('click').click(function() {
        var selItem = $(this);
        $('#newEdgeDlgType').removeClass('unselected').html(selItem.html());
    });

    networkGraph.setEdgeTypes(edgeTypes);
    updateEdgeList();
    networkGraph.updateGraph();
}

function updateEdgeList(event, updatedData) {
    if (event == undefined || updatedData == undefined)
        event = updatedData = null;

    var newListItems = null;
    if (updatedData == null) {
        $('#sideMenuEdgeList').empty();
        for (var i = 0; i < networkGraph.edges.length; i++) {
            var edgeData = networkGraph.edges[i];
            var edgeType = edgeData.type;
            if (edgeType == null) edgeType = networkGraph.EDGE_TYPE_DEFAULT;
            var edgeInfoHtml = "<li><a data-type='" + edgeType + "' data-ct='" + edgeData.ct
                + "'><span class='edge-source' data-nodeid='"
                + edgeData.source.id + "'>" + edgeData.source.title + "</span>"
                + "<span class='edge-pointer'>-></span>"
                + "<span class='edge-target' data-nodeid='" + edgeData.target.id
                + "'>" + edgeData.target.title + "</span></a></li>";
            $('#sideMenuEdgeList').append(edgeInfoHtml);
        }
        newListItems = $('#sideMenuEdgeList > li > a');
    } else {
        if (event == 'created') {
            var edgeType = updatedData.type;
            if (edgeType == null) edgeType = networkGraph.EDGE_TYPE_DEFAULT;
            var edgeInfoHtml = "<li><a data-type='" + edgeType + "' data-ct='" + updatedData.ct
                + "'><span class='edge-source' data-nodeid='"
                + updatedData.source.id + "'>" + updatedData.source.title + "</span>"
                + "<span class='edge-pointer'>-></span>"
                + "<span class='edge-target' data-nodeid='" + updatedData.target.id
                + "'>" + updatedData.target.title + "</span></a></li>";
            $('#sideMenuEdgeList').append(edgeInfoHtml);
            newListItems = $('#sideMenuEdgeList > li > a:last');
        } else if (event == 'updated') {
            $('#sideMenuEdgeList > li > a').each(function(idx, elem) {
                // if (updatedData.source.id == $(this).find('.edge-source').data('nodeid') &&
                //         updatedData.target.id == $(this).find('.edge-target').data('nodeid')) {
                if (updatedData.ct == parseInt($(this).data('ct'))) {
                    $(this).find('.edge-source').data('nodeid', updatedData.source.id)
                        .text(updatedData.source.title);
                    $(this).find('.edge-target').data('nodeid', updatedData.target.id)
                        .text(updatedData.target.title);
                    var edgeType = updatedData.type;
                    if (edgeType == null) edgeType = networkGraph.EDGE_TYPE_DEFAULT;
                    $(this).data('type', edgeType);
                }
            });
        } else if (event == 'deleted') {
            var deletedElem = null;
            $('#sideMenuEdgeList > li > a').each(function(idx, elem) {
                // if (updatedData.source.id == $(this).find('.edge-source').data('nodeid') &&
                //         updatedData.target.id == $(this).find('.edge-target').data('nodeid')) {
                if (updatedData.ct == parseInt($(this).data('ct'))) {
                    deletedElem = $(this);
                }
            });
            if (deletedElem != null) deletedElem.remove();
        }
    }
    if (newListItems != null) {
        newListItems.off('click').unbind('click').click(function() {
            var selItem = $(this);
            if (selItem.hasClass('active')) {
                selItem.removeClass('active');
                networkGraph.unselect();
            } else {
                $('#sideMenuNodeList > li > a, #sideMenuEdgeList > li > a').removeClass('active');
                selItem.addClass('active');
                var edgeType = selItem.data('type');
                if (edgeType == networkGraph.EDGE_TYPE_DEFAULT) {
                    edgeType = null;
                } else {
                    edgeType = parseInt(edgeType);
                }
                networkGraph.selectEdge(selItem.find('.edge-source').data('nodeid'),
                    selItem.find('.edge-target').data('nodeid'), edgeType);
            }
        });
    }
}

var selectedNode = null;
function setSelectedNode(d3Node, nodeData) {
    switchSecondMenu('show');
    $('#subMenuEdge').hide();
    $('#subMenuNone').hide();
    $('#subMenuNode').show();

    $('.menuDeleteNode').attr('disabled', false);
    $('.menuDeleteNode').removeClass('disabled');
    $('.menuDeleteEdge').attr('disabled', true);
    $('.menuDeleteEdge').addClass('disabled');

    if(nodeData.title != "New Node")
        $('#subMenuNodeName').val(nodeData.title);
    else
        $('#subMenuNodeName').val('');
    if ('domainId' in nodeData && nodeData.domainId != null)
        $('#subMenuDomainId').val(nodeData.domainId);
    else $('#subMenuDomainId').val('');
    if (nodeData.type != null) {
        $('#subMenuNodeType').removeClass('unselected').html(nodeTypeToSubMenuHtml(nodeData.type));
    } else {
        // $('#subMenuNodeType').addClass('unselected').text("Select Type");
        $('#subMenuNodeType').removeClass('unselected').html(nodeTypeToSubMenuHtml(null));
    }

    $('#sideMenuNodeList > li > a').removeClass('active');
    $('#sideMenuEdgeList > li > a').removeClass('active');
    $('#sideMenuNodeList > li > a').each(function(idx, elem) {
        if (nodeData.id == $(this).data('nodeid')) {
            $(this).addClass('active').focus();
        }
    });

    selectedEdge = null;
    selectedNode = {
        'd3Node': d3Node,
        'nodeData': nodeData
    }
}
var selectedEdge = null;
function setSelectedEdge(d3PathG, edgeData) {
    switchSecondMenu('show');
    $('#subMenuNode').hide();
    $('#subMenuNone').hide();
    $('#subMenuEdge').show();

    $('.menuDeleteNode').attr('disabled', true);
    $('.menuDeleteNode').addClass('disabled');
    $('.menuDeleteEdge').attr('disabled', false);
    $('.menuDeleteEdge').removeClass('disabled');

    $('#subMenuEdgeInfluence').val(edgeData.name);
    $('#subMenuEdgeSource').removeClass('unselected').html(nodeDataToSubMenuHtml(edgeData.source));
    $('#subMenuEdgeTarget').removeClass('unselected').html(nodeDataToSubMenuHtml(edgeData.target));
    if (edgeData.type != null) {
        $('#subMenuEdgeType').removeClass('unselected').html(edgeTypeToSubMenuHtml(edgeData.type));
    } else {
        // $('#subMenuEdgeType').addClass('unselected').text("Select Type");
        $('#subMenuEdgeType').removeClass('unselected').html(edgeTypeToSubMenuHtml(edgeData.type));
    }

    $('#sideMenuNodeList > li > a').removeClass('active');
    $('#sideMenuEdgeList > li > a').removeClass('active');
    $('#sideMenuEdgeList > li > a').each(function(idx, elem) {
        // if (edgeData.source.id == $(this).find('.edge-source').data('nodeid') &&
        //         edgeData.target.id == $(this).find('.edge-target').data('nodeid')) {
        if (edgeData.ct == parseInt($(this).data('ct'))) {
            $(this).addClass('active').focus();
        }
    });

    selectedNode = null;
    selectedEdge = {
        'd3PathG': d3PathG,
        'edgeData': edgeData
    }
}
function setUnselected(graphUnselect) {
    switchSecondMenu('hide');
    $('#subMenuNode').hide();
    $('#subMenuEdge').hide();
    $('#subMenuNone').show();

    $('.menuDeleteNode').attr('disabled', true);
    $('.menuDeleteNode').addClass('disabled');
    $('.menuDeleteEdge').attr('disabled', true);
    $('.menuDeleteEdge').addClass('disabled');

    $('#subMenuNodeName').val('');
    $('#subMenuDomainId').val('');
    $('#subMenuNodeType').addClass('unselected').text('');
    $('#subMenuEdgeType').addClass('unselected').text('');
    $('#subMenuEdgeInfluence').val('');
    $('.subMenuEdgeNode').addClass('unselected').text('');

    $('#sideMenuNodeList > li > a').removeClass('active');
    $('#sideMenuEdgeList > li > a').removeClass('active');

    if (graphUnselect) {
        if (networkGraph.state.selectedEdge != null)
            networkGraph.removeSelectFromEdge();
        else if (networkGraph.state.selectedNode != null)
            networkGraph.removeSelectFromNode();
    }
    networkGraph.setEdgeViewMode(networkGraph.EDGE_VIEW_MODE_SELECTED, viewedEdgeTypes);

    selectedNode = null;
    selectedEdge = null;
}

function nodeTypeToSubMenuHtml(typeid) {
    if(typeid != null)
        return "<span class='nodeTypeColor type-color-bg type-color-"
            + nodeTypes[typeid]['color'] + "'>&nbsp;</span><span class='nodeTypeName'>"
            + nodeTypes[typeid]['name'] +"</span><span class='nodeTypeId'>"
            + typeid + "</span>";
    else
        return "<span class='nodeTypeColor type-color-bg type-color-default'>&nbsp;</span><span class='nodeTypeName'>"
            + "No Type" +"</span><span class='nodeTypeId'>"
            + null + "</span>";
}
function nodeDataToSubMenuHtml(nodeData) {
    var nodeInfoHtml = "<span class='nodeName' data-nodeId=" + nodeData.id
            + ">" + nodeData.title + "</span> ( ";
    if (nodeData.type == null) {
        nodeInfoHtml += "No Type )";
    } else {
        nodeInfoHtml += "<span class='nodeTypeColor type-color-bg type-color-"
            + nodeTypes[nodeData.type]['color'] + "'>&nbsp;</span><span class='nodeTypeName'>"
            + nodeTypes[nodeData.type]['name'] +"</span><span class='nodeTypeId'>" +
            + nodeData.type + "</span> )";
    }
    return nodeInfoHtml;
}
function edgeTypeToSubMenuHtml(typeid) {
    if (typeid == null) {
        return "<span class='edgeTypeColor type-color-bg type-color-default"
            + "'>&nbsp;</span><span class='edgeTypeName'>"
            + "Default Edge Type</span><span class='edgeTypeId'>"
            + null + "</span>";
    } else {
        return "<span class='edgeTypeColor type-color-bg type-color-"
            + edgeTypes[typeid]['color'] + "'>&nbsp;</span><span class='edgeTypeName'>"
            + edgeTypes[typeid]['name'] + "</span><span class='edgeTypeId'>"
            + typeid + "</span>";
    }
}

function createNode() {
    var createdNode = networkGraph.createNode();
    updateNodeList('created', createdNode);
    networkGraph.selectNode(createdNode.id);
}
function editNode() {
    var initialNode = {id : null, title : null, type : null, domainId : null};
    initialNode['id'] = selectedNode.nodeData.id;

    if (selectedNode != null) {
        var originalType = selectedNode.nodeData.type;
        if($('#subMenuNodeName').val() != '') {
            initialNode['title'] = selectedNode.nodeData.title;
            selectedNode.nodeData.title = $('#subMenuNodeName').val();
        }
        initialNode['type'] = selectedNode.nodeData.type;
        // selectedNode.nodeData.type = $('#subMenuNodeType .nodeTypeName').text();
        selectedNode.nodeData.type = parseInt($('#subMenuNodeType .nodeTypeId').text());

        var domainId = $('#subMenuDomainId').val();
        if (/\S/.test(domainId)) {
            //check domain
            var duplicated = false;
            for (var i=0; i<networkGraph.nodes.length; i++) {
                var nodeData = networkGraph.nodes[i];
                if (selectedNode.nodeData == nodeData) continue;
                if ('domainId' in nodeData) {
                    if (nodeData['domainId'] == domainId) {
                        duplicated = true;
                        break;
                    }
                }
            }
            if(duplicated) {
                openAlertModal("The domain ID is duplicated.", "Edit Node Failure")
            } else {
                initialNode['domainId'] = selectedNode.nodeData.domainId;
                selectedNode.nodeData.domainId = domainId;
            }
        }
        else selectedNode.nodeData.domainId = null;

        memento.saveState({function_name : "editNode", data : initialNode});
        networkGraph.changeNodeTitle(selectedNode.d3Node, selectedNode.nodeData.title);
        if (originalType != selectedNode.nodeData.type) {
            networkGraph.updateNodeType(selectedNode.d3Node);
        }
        networkGraph.updateGraph();
        updateNodeList('updated', selectedNode.nodeData);
        showSnackBar("Updated");
    }
}
function deleteNode() {
    if (selectedNode != null) {
        var deletedNode = selectedNode.nodeData;
        networkGraph.deleteNode();
        setUnselected();
        updateNodeList('deleted', deletedNode);
    }
}

function createEdge() {
    if (networkGraph.nodes.length < 2) {
        openAlertModal("Edge can be created when there are more than two nodes.");
    } else {
        $('#newEdgeDlgInfluence').val('0.5');
        if (selectedNode == null) {
            $('#newEdgeDlgSource').addClass('unselected').html("Select Source Node");
        } else {
            $('#newEdgeDlgSource').removeClass('unselected').html(nodeDataToSubMenuHtml(selectedNode.nodeData));
        }
        $('#newEdgeDlgTarget').addClass('unselected').html("Select Target Node");
        // $('#newEdgeDlgType').addClass('unselected').html("Select Type");
        $('#newEdgeDlgType').removeClass('unselected').html(edgeTypeToSubMenuHtml(null));
        $("#newEdgeModal .modal-content").draggable({
            handle : ".modal-header",
            containment: "body",
            scroll: false
        });
        $('#newEdgeModal').modal();
    }
}
function createEdgeConfirm() {
    var sourceId = parseInt($('#newEdgeDlgSource .nodeName').data('nodeid')),
        targetId = parseInt($('#newEdgeDlgTarget .nodeName').data('nodeid')),
        influence = parseFloat($('#newEdgeDlgInfluence').val()),
        edgeType = null;
    var sourceNode = networkGraph.getNodeById(sourceId),
        targetNode = networkGraph.getNodeById(targetId);
    if (!$('#newEdgeDlgType').hasClass('unselected'))
        edgeType = parseInt($('#newEdgeDlgType').find('> .edgeTypeId').text());

    if (isNaN(sourceId) || isNaN(targetId)) {
        openAlertModal("The nodes of edge must be selected!");
        return;
    } else if (sourceId == targetId) {
        openAlertModal("The nodes of edge can not be same!");
        return;
    } else if (isNaN(influence) || !isFinite(influence)) {
        openAlertModal("The influence value is must be set!");
        return;
    } else if (validEdge(sourceNode, targetNode, edgeType)) {
        var newEdge = networkGraph.createEdge(sourceNode, targetNode, influence, edgeType);
        if (newEdge != null) {
            setUnselected(true);
            closeAnalysisToast();
            networkGraph.selectEdge(sourceId, targetId, edgeType);
            updateEdgeList('created', newEdge);
            $('#newEdgeModal').modal('hide');
        } else {
            openAlertModal("The edge is already existed!");
        }
    } else {
        openAlertModal("The edge is already existed!");
    }
}
function editEdge() {
    var initialEdge = {};
    if (selectedEdge != null) {
        initialEdge.name = selectedEdge.edgeData.name;
        initialEdge.type = selectedEdge.edgeData.type;

        var originalType = selectedEdge.edgeData.type;
        var originalSourceId = selectedEdge.edgeData.source.id,
            originalTargetId = selectedEdge.edgeData.target.id;
        var changedType = null;
        var changedSourceId = parseInt($('#subMenuEdgeSource .nodeName').data('nodeid')),
            changedTargetId = parseInt($('#subMenuEdgeTarget .nodeName').data('nodeid'));
        if (!$('#subMenuEdgeType').hasClass('unselected'))
            changedType = parseInt($('#subMenuEdgeType .edgeTypeId').text());

        selectedEdge.edgeData.name = $('#subMenuEdgeInfluence').val();

        if ((originalSourceId == changedSourceId && originalTargetId == changedTargetId
                && originalType == changedType) || (originalSourceId == changedSourceId && originalTargetId == changedTargetId
            && (originalType == null && isNaN(changedType)))) {
            //pass
        } else {
            var changedSource = networkGraph.getNodeById(changedSourceId),
                changedTarget = networkGraph.getNodeById(changedTargetId);
            if (changedSourceId == changedTargetId) {
                openAlertModal("The source and target of edge can not be same!");
                return;
            } else if (validEdge(changedSource, changedTarget, changedType)) {
                selectedEdge.edgeData.source = changedSource;
                selectedEdge.edgeData.target = changedTarget;
                selectedEdge.edgeData.type = changedType;
                networkGraph.updateEdges();
            } else {
                openAlertModal("The path is already existed!");
                return;
            }
        }

        networkGraph.changeEdgeName(selectedEdge.d3PathG, selectedEdge.edgeData);
        if (originalType != selectedEdge.edgeData.type) {
            networkGraph.updateEdgeType(selectedEdge.d3PathG);
        }
        memento.saveState({function_name : "editEdge", data : {edge : selectedEdge.edgeData, init : initialEdge}});
        networkGraph.updateGraph();
        updateEdgeList('updated', selectedEdge.edgeData);
        showSnackBar("Updated");
    }
}
function deleteEdge() {
    if (selectedEdge != null) {
        var deletedEdge = selectedEdge.edgeData;
        networkGraph.deleteEdge();
        setUnselected();
        updateEdgeList('deleted', deletedEdge);
    }
}
function validEdge(sourceNode, targetNode, type) {
    for (var i=0; i<networkGraph.edges.length; i++) {
        var edge = networkGraph.edges[i];
        if (edge.source === sourceNode && edge.target === targetNode
                && edge.type == type) {
            return false;
        }
        else if (edge.source === sourceNode && edge.target === targetNode
            && (edge.type == null && isNaN(type))) {
            return false;
        }
    }
    return true;
}

function manageNodeType() {
    $('#manageNodeTypeModal').modal();
}
function manageEdgeType() {
    $('#manageEdgeTypeModal').modal();
}
function manageConfidence() {
    $('#manageConfidenceModal').modal();
}
function manageEdgeTypeView() {
    $('#manageEdgeTypeViewModal').modal();
}
$(function () {
    if ($.cookie('check_remember') == "true") {
        $('#checkRemember').attr("checked", true);
        $('#signinEmail').val($.cookie('email'));
        $('#signinPassword').val($.cookie('password'));
    }
});

function Stack() {
    this.stack = new Array();
    this.pop = function () {
        return this.stack.pop();
    }
    this.push = function (item) {
        this.stack.push(item);
    }
}

function Memento() {
    this.states = new Stack();
}

Memento.prototype.saveState = function (item) {
    this.states.push(item);
}

Memento.prototype.undo = function () {
    if(this.states.stack.length > 0) {
        var state = this.states.pop();
        if(state.function_name == "createNode") {
            networkGraph.nodes.splice(networkGraph.nodes.indexOf(state.data), 1);
            networkGraph.updateGraph();
            updateNodeList('deleted', state.data);
        } else if(state.function_name == "deleteNode") {
            networkGraph.nodes.push(state.data.node);
            state.data.edge.forEach(function (element) {
                networkGraph.edges.push(element);
                updateEdgeList('created', element);
            });
            updateNodeList('created', state.data.node);
            networkGraph.updateGraph();
        } else if(state.function_name == "moveNode") {
            for(var key in networkGraph.nodes) {
                if(networkGraph.nodes[key].id == state.data.id) {
                    networkGraph.nodes[key].x = state.data.x;
                    networkGraph.nodes[key].y = state.data.y;
                    networkGraph.updateGraph();
                    break;
                }
            }
        } else if(state.function_name == "editNode") {
            for(var key in networkGraph.nodes) {
                if(networkGraph.nodes[key].id == state.data.id) {
                    setUnselected(true);
                    networkGraph.nodes[key].title = state.data.title;
                    networkGraph.nodes[key].type = state.data.type;
                    networkGraph.nodes[key].domainId = state.data.domainId;
                    networkGraph.updateGraph();
                    var d3Node = networkGraph.circles.filter(function(cd) {
                        return cd.id === state.data.id;
                    });
                    networkGraph.changeNodeTitle(d3Node, state.data.title);
                    networkGraph.updateNodeType(d3Node);
                    updateNodeList('updated', networkGraph.nodes[key]);
                    break;
                }
            }
        } else if(state.function_name == "createEdge") {
            networkGraph.edges.splice(networkGraph.edges.indexOf(state.data), 1);
            updateEdgeList('deleted', state.data);
            networkGraph.updateGraph();
        } else if(state.function_name == "editEdge") {
            setUnselected(true);
            state.data.edge.name = state.data.init.name;
            state.data.edge.type = state.data.init.type;
            var d3PathG = networkGraph.paths.filter(function(d) {
                return state.data.edge == d;
            });
            networkGraph.updateEdgeType(d3PathG);
            networkGraph.updateGraph();
        } else if(state.function_name == "deleteEdge") {
            networkGraph.edges.push(state.data);
            updateNodeList('created', state.data);
            networkGraph.updateGraph();
        }
    }
}

$(document).ready(function() {

    $(document).bind('keydown', "Ctrl+z", function() {memento.undo()});

    // window.onbeforeunload = function(){
    //     return "Make sure to save your graph locally before leaving :-)";
    // };

    if ($.cookie('check_remember') == true) { //Login window, check remember
        $('#checkRemember').attr("checked", true);
        $('#signinEmail').val($.cookie('email'));
        $('#signinPassword').val($.cookie('password'));
    }

    setUnselected();
    updateNodeTypes();
    updateEdgeTypes();
    updateEdgeList();

    networkGraph.setCallbacks(
        function (d3Node, nodeData) {       // onNodeSelected
            setSelectedNode(d3Node, nodeData);
        }, function (d3PathG, edgeData) {   // onEdgeSelected
            // console.log(edgeData);
            setSelectedEdge(d3PathG, edgeData);
        }, function () {                    // onUnselected
            // console.log("unselected");
            setUnselected();

        }, function(event, nodeData) {      // onNodeChanged
            updateNodeList(event, nodeData);
            networkGraph.isChanged = true;
            toggleAskCloseAndRefresh();
        }, function(event, edgeData) {      // onEdgeChanged
            updateEdgeList(event, edgeData);
            networkGraph.isChanged = true;
            toggleAskCloseAndRefresh();
        }
    );

    initUI();

    $('#subMenuNodeEditBtn').click(editNode);
    $('#subMenuEdgeEditBtn').click(editEdge);

    $('.menuUndo').click(function() {memento.undo()});
    $('.menuNewNode').click(createNode);
    $('.menuDeleteNode').click(deleteNode);
    $('.menuNewEdge').click(createEdge);
    $('.menuDeleteEdge').click(deleteEdge);

    $('.menuManageNodeType').click(manageNodeType);
    $('.menuManageEdgeType').click(manageEdgeType);
    $('.menuManageConfidence').click(manageConfidence);
    $('.menuManageEdgeTypeView').click(manageEdgeTypeView);

    $('.menuNew').click(menuNewGraph);
    $('.menuOpen').click(menuOpenGraph);
    $('.menuEditName').click(menuEditGraphName);
    $('.menuDelete').click(menuDeleteGraph);
    $('.menuClose').click(menuCloseGraph);
    $('.menuSave').click(menuSaveGraph);
    $('.menuSaveAs').click(menuSaveAsGraph);
    $('.menuPrint').click(menuPrintGraph);
    $('.menuSaveAsImage').click(menuSaveAsImage);

    $('.menuMaxInfluence').click(menuFindMaxInfluence);
    $('.menuMostSumInfluence').click(menuFindMostSumInfluence);
    $('.menuMostAverageInfluence').click(menuFindMostAverageInfluence);

    $('.menuMaxInfluenceTable').click(menuFindMaxInfluenceTable);

    $('#closeGraph').click(menuCloseGraph);
    $('#saveGraph').click(menuSaveGraph);
    $('#printGraph').click(menuPrintGraph);
    $('#editGraphName').click(menuEditGraphName);
    $('#deleteGraph').click(menuDeleteGraph);

    networkGraph.isChanged = false;
    toggleAskCloseAndRefresh();

    /* Double click auto scale */
    $('.graph-area svg').on('dblclick', function (e) {
        // console.log(this);
        if(e.target == this)
            networkGraph.setZoom(true);
    });
});

var selectedNodeTypeElem = null;
var selectedEdgeTypeElem = null;
function initUI() {
    // About Edge
    $('#subMenuEdgeInfluence, #newEdgeDlgInfluence').blur(function() {
        var influence = parseFloat($(this).val());
        if (isNaN(influence) || !isFinite(influence)) {
            $(this).val(0);
        } else if (influence < 0) {
            $(this).val(0);
        } else if (influence > 1) {
            $(this).val(1);
        }
    });
    $('#btnNewEdgeModalConfirm').click(createEdgeConfirm);

    // Confirm Modal
    $('#confirmModal').on('hidden.bs.modal', function (e) {
        $('#btnConfirmModal').off('click').unbind('click');
    });

    initManageNodeTypeUI();
    initManageEdgeTypeUI();
    initManageConfidenceUI();
    initManageEdgeTypeViewUI();
    initFindMaxInfluencePathUI();
    initMaxInfluenceTableUI();
    initFindMostInfluenceNodeUI("Sum");
    initFindMostInfluenceNodeUI("Avg");
    initControllers();

}

function initManageNodeTypeUI() {
    $("#manageNodeTypeModal .modal-content").draggable({
        handle : ".modal-header",
        containment: "body",
        scroll: false
    });

    $('#btnEditNodeTypeName').attr('disabled', true);
    $('#btnDeleteNodeType').attr('disabled', true);
    $('#manageNodeTypeColorList').css('visibility', 'hidden');

    $('#manageNodeTypeModal').on('hide.bs.modal', function (e) {
        setUnselected(true);
        if(updateNodeType==true) {
            updateNodeTypes();
            updateNodeType = false;
        }
    });
    $('#manageNodeTypeModal').on('hidden.bs.modal', function (e) {
        selectedNodeTypeElem = null;
        $('#btnEditNodeTypeName').attr('disabled', true);
        $('#btnDeleteNodeType').attr('disabled', true);
        $('#manageNodeTypeColorList').css('visibility', 'hidden');
        $('#manageNodeTypeList > .list-group-item').each(function() {
            $(this).attr('class', 'list-group-item');
        });
        $('#manageNodeTypeColorList > .list-group-item').each(function() {
            $(this).attr('class', 'list-group-item');
        });
    });

    updateManageNodeTypeUI();

    $('#btnAddNodeType').click(function() {
        var usedNames = [];
        var usedColors = [];
        for (var typeid in nodeTypes) {
            usedNames.push(nodeTypes[typeid]['name']);
            usedColors.push(nodeTypes[typeid]['color']);
        }

        var defaultNewTypeName = 'New Type';
        var defaultCnt = 1;
        while (true) {
            var used = false;
            for (var k=0; k<usedNames.length; k++) {
                if (defaultNewTypeName == usedNames[k]) {
                    used = true;
                    break;
                }
            }
            if (used) {
                defaultCnt++;
                defaultNewTypeName = 'New Type ' + defaultCnt;
            } else {
                break;
            }
        }

        var defaultNewTypeColor = null;
        var remainedColors = [];
        for (var i=0; i<typeColors.length; i++) {
            var color = typeColors[i];
            var used = false;
            for (var k=0; k<usedColors.length; k++) {
                if (color == usedColors[k]) {
                    used = true;
                    break;
                }
            }
            if (!used) remainedColors.push(color);
        }
        if (remainedColors.length > 0) {
            var randColorIdx = Math.floor((Math.random() * remainedColors.length));
            defaultNewTypeColor = remainedColors[randColorIdx];
        } else {
            var randColorIdx = Math.floor((Math.random() * typeColors.length));
            defaultNewTypeColor = typeColors[randColorIdx];
        }

        //reset active other list item
        $('#manageNodeTypeList > .list-group-item').each(function() {
            $(this).attr('class', 'list-group-item');
        });

        //add list item
        $('#manageNodeTypeList').append("<a class='list-group-item'>"
            + "<span class='nodeTypeName'>" + defaultNewTypeName + "</span>"
            + "<span class='typeColor type-color-bg type-color-" + defaultNewTypeColor
            + "' data-color='" + defaultNewTypeColor + "'>&nbsp;</span>"
            + "<span class='typeId'>" + nodeTypeCnt + "</span></a>");
        //add nodeTypes with default
        nodeTypes[nodeTypeCnt] = {name: defaultNewTypeName, color:defaultNewTypeColor};
        // add confidence table
        addNodeTypeConfidence(nodeTypeCnt);
        nodeTypeCnt++;

        var appendedElem = $('#manageNodeTypeList').find('.list-group-item:last-of-type');
        nodeTypeManageListItemAddClick(appendedElem);
        appendedElem.find('> .nodeTypeName').attr('contenteditable', true)
            .blur(function() {
                $(this).attr('contenteditable', false);
                var typeid = parseInt(appendedElem.find('> .typeId').text());
                nodeTypes[typeid]['name'] = $(this).text();
                editNodeTypeConfidenceName(typeid);
                window.getSelection().removeAllRanges();
            }).keydown(function(e) {
                if (e.which == 13) {
                    $(this).blur();
                }
            }).focus();
        document.execCommand('selectAll', false, null);

        updateNodeType = true;
    });

    $('#btnEditNodeTypeName').click(function() {
        if (selectedNodeTypeElem != null) {
            var typeColor = selectedNodeTypeElem.find('> .typeColor').data('color');
            var nowElem = selectedNodeTypeElem;
            var classes = selectedNodeTypeElem.attr('class');
            selectedNodeTypeElem.attr('class', 'list-group-item');

            selectedNodeTypeElem.find('> .nodeTypeName').attr('contenteditable', true)
                .blur(function() {
                    $(this).attr('contenteditable', false);
                    var typeid = parseInt(nowElem.find('> .typeId').text());
                    nodeTypes[typeid]['name'] = $(this).text();
                    editNodeTypeConfidenceName(typeid);
                    window.getSelection().removeAllRanges();

                    // if (selectedNodeTypeElem != null)
                    if (selectedNodeTypeElem == nowElem)
                        selectedNodeTypeElem.attr('class', classes);
                }).keydown(function(e) {
                    if (e.which == 13) {
                        $(this).blur();
                    }
                }).focus();
            document.execCommand('selectAll', false, null);

            updateNodeType = true;
        }
    });

    $('#btnDeleteNodeType').click(function() {
        if (selectedNodeTypeElem != null) {
            var typeid = parseInt(selectedNodeTypeElem.find('> .typeId').text());
            var typeUsed = false;
            for (var i=0; i<networkGraph.nodes.length; i++) {
                if (networkGraph.nodes[i].type == typeid) {
                    typeUsed = true;
                    break;
                }
            }

            if (typeUsed) {
                openAlertModal("Deleting node type is not performed. The node type is used.", "Cannnot Delete Node Type")
            } else {
                delete nodeTypes[typeid];

                selectedNodeTypeElem.remove();
                selectedNodeTypeElem = null;
                $('#btnEditNodeTypeName').attr('disabled', true);
                $('#btnDeleteNodeType').attr('disabled', true);
                $('#manageNodeTypeColorList').css('visibility', 'hidden');

                deleteNodeTypeConfidence(typeid);

                updateNodeType = true;
            }
        }
    });

    $('#manageNodeTypeColorList > .list-group-item').click(function() {
        var color = $(this).data('color');
        $('#manageNodeTypeColorList > .list-group-item').each(function() {
            $(this).attr('class', 'list-group-item');
        });
        $(this).addClass('active').addClass('type-color-bg')
            .addClass('type-color-text').addClass('type-color-'+color);

        if (selectedNodeTypeElem != null) {
            var prevColor = selectedNodeTypeElem.find('> .typeColor').data('color');
            selectedNodeTypeElem.attr('class', 'list-group-item active');
            selectedNodeTypeElem.addClass('type-color-bg')
                .addClass('type-color-text').addClass('type-color-' + color);
            selectedNodeTypeElem.find('> .typeColor').removeClass('type-color-' + prevColor)
                .addClass('type-color-' + color).data('color', color);

            var typeId = parseInt(selectedNodeTypeElem.find('> .typeId').text());
            nodeTypes[typeId]['color'] = color;
            editNodeTypeConfidenceName(typeId);
        }
    });
}

function updateManageNodeTypeUI() {
    $('#manageNodeTypeList').empty();
    for (var typeid in nodeTypes) {
        $('#manageNodeTypeList').append("<a class='list-group-item'>"
            + "<span class='nodeTypeName'>" + nodeTypes[typeid]['name'] + "</span>"
            + "<span class='typeColor type-color-bg type-color-" + nodeTypes[typeid]['color']
            + "' data-color='" + nodeTypes[typeid]['color'] + "'>&nbsp;</span>"
            + "<span class='typeId'>" + typeid + "</span></a>");
        var appendedElem = $('#manageNodeTypeList').find('.list-group-item:last-of-type');
        nodeTypeManageListItemAddClick(appendedElem);
    }
}

function nodeTypeManageListItemAddClick(elem) {
    elem.click(function() {
        if ($(this).hasClass('active')) {   //active->inactive
            selectedNodeTypeElem = null;
            $(this).find('> .nodeTypeName').blur();
            $(this).attr('class', 'list-group-item');

            $('#btnEditNodeTypeName').attr('disabled', true);
            $('#btnDeleteNodeType').attr('disabled', true);
            $('#manageNodeTypeColorList').css('visibility', 'hidden');
            $('#manageNodeTypeColorList > .list-group-item').each(function() {
                $(this).attr('class', 'list-group-item');
            });
        } else {    //inactive->active
            selectedNodeTypeElem = $(this);
            var typeColor = $(this).find('> .typeColor').data('color');
            $('#manageNodeTypeList > .list-group-item').each(function() {
                $(this).attr('class', 'list-group-item');
            });
            $(this).addClass('active').addClass('type-color-bg')
                .addClass('type-color-text').addClass('type-color-'+typeColor);

            $('#btnEditNodeTypeName').attr('disabled', false);
            $('#btnDeleteNodeType').attr('disabled', false);
            $('#manageNodeTypeColorList').css('visibility', 'visible');
            $('#manageNodeTypeColorList > .list-group-item').each(function() {
                if ($(this).data('color') == typeColor) {
                    $(this).addClass('active').addClass('type-color-bg')
                        .addClass('type-color-text').addClass('type-color-'+typeColor);
                    $('#manageNodeTypeColorList').focus();
                    $(this).focus().blur();
                } else {
                    $(this).attr('class', 'list-group-item');
                }
            });
        }
    });
}

function initManageEdgeTypeUI() {
    $("#manageEdgeTypeModal .modal-content").draggable({
        handle : ".modal-header",
        containment: "body",
        scroll: false
    });

    $('#btnEditEdgeTypeName').attr('disabled', true);
    $('#btnDeleteEdgeType').attr('disabled', true);
    $('#manageEdgeTypeColorList').css('visibility', 'hidden');

    $('#manageEdgeTypeModal').on('hide.bs.modal', function (e) {
        setUnselected(true);
        if(updateEdgeType == true) {
            updateEdgeTypes();
            updateEdgeType = false;
        }
    });
    $('#manageEdgeTypeModal').on('hidden.bs.modal', function (e) {
        selectedEdgeTypeElem = null;
        $('#btnEditEdgeTypeName').attr('disabled', true);
        $('#btnDeleteEdgeType').attr('disabled', true);
        $('#manageEdgeTypeColorList').css('visibility', 'hidden');
        $('#manageEdgeTypeList > .list-group-item').each(function() {
            $(this).attr('class', 'list-group-item');
        });
        $('#manageEdgeTypeColorList > .list-group-item').each(function() {
            $(this).attr('class', 'list-group-item');
        });
    });

    updateManageEdgeTypeUI();

    $('#btnAddEdgeType').click(function() {
        var usedNames = [];
        var usedColors = [];
        for (var typeid in edgeTypes) {
            usedNames.push(edgeTypes[typeid]['name']);
            usedColors.push(edgeTypes[typeid]['color']);
        }

        var defaultNewTypeName = 'New Edge Type';
        var defaultCnt = 1;
        while (true) {
            var used = false;
            for (var k=0; k<usedNames.length; k++) {
                if (defaultNewTypeName == usedNames[k]) {
                    used = true;
                    break;
                }
            }
            if (used) {
                defaultCnt++;
                defaultNewTypeName = 'New Edge Type ' + defaultCnt;
            } else {
                break;
            }
        }

        var defaultNewTypeColor = null;
        var remainedColors = [];
        for (var i=0; i<typeColors.length; i++) {
            var color = typeColors[i];
            var used = false;
            for (var k=0; k<usedColors.length; k++) {
                if (color == usedColors[k]) {
                    used = true;
                    break;
                }
            }
            if (!used) remainedColors.push(color);
        }
        if (remainedColors.length > 0) {
            var randColorIdx = Math.floor((Math.random() * remainedColors.length));
            defaultNewTypeColor = remainedColors[randColorIdx];
        } else {
            var randColorIdx = Math.floor((Math.random() * typeColors.length));
            defaultNewTypeColor = typeColors[randColorIdx];
        }

        //reset active other list item
        $('#manageEdgeTypeList > .list-group-item').each(function() {
            $(this).attr('class', 'list-group-item');
        });

        //add list item
        $('#manageEdgeTypeList').append("<a class='list-group-item'>"
            + "<span class='edgeTypeName'>" + defaultNewTypeName + "</span>"
            + "<span class='typeColor type-color-bg type-color-" + defaultNewTypeColor
            + "' data-color='" + defaultNewTypeColor + "'>&nbsp;</span>"
            + "<span class='typeId'>" + edgeTypeCnt + "</span></a>");
        //add edgeTypes with default
        edgeTypes[edgeTypeCnt] = {name: defaultNewTypeName, color:defaultNewTypeColor};
        if (networkGraph.edgeViewMode == networkGraph.EDGE_VIEW_MODE_SELECTED) {
            viewedEdgeTypes.push(edgeTypeCnt);
            networkGraph.setEdgeViewMode(networkGraph.EDGE_VIEW_MODE_SELECTED, viewedEdgeTypes);
        }
        edgeTypeCnt++;


        var appendedElem = $('#manageEdgeTypeList').find('.list-group-item:last-of-type');
        edgeTypeManageListItemAddClick(appendedElem);
        appendedElem.find('> .edgeTypeName').attr('contenteditable', true)
            .blur(function() {
                $(this).attr('contenteditable', false);
                var typeid = parseInt(appendedElem.find('> .typeId').text());
                edgeTypes[typeid]['name'] = $(this).text();
                window.getSelection().removeAllRanges();
            }).keydown(function(e) {
            if (e.which == 13) {
                $(this).blur();
            }
        }).focus();
        document.execCommand('selectAll', false, null);

        updateEdgeType = true;
    });

    $('#btnEditEdgeTypeName').click(function() {
        if (selectedEdgeTypeElem != null) {
            var typeColor = selectedEdgeTypeElem.find('> .typeColor').data('color');
            var nowElem = selectedEdgeTypeElem;
            var classes = selectedEdgeTypeElem.attr('class');
            selectedEdgeTypeElem.attr('class', 'list-group-item');

            selectedEdgeTypeElem.find('> .edgeTypeName').attr('contenteditable', true)
                .blur(function() {
                    $(this).attr('contenteditable', false);
                    var typeid = parseInt(nowElem.find('> .typeId').text());
                    edgeTypes[typeid]['name'] = $(this).text();
                    window.getSelection().removeAllRanges();

                    // if (selectedEdgeTypeElem != null)
                    if (selectedEdgeTypeElem == nowElem)
                        selectedEdgeTypeElem.attr('class', classes);
                }).keydown(function(e) {
                if (e.which == 13) {
                    $(this).blur();
                }
            }).focus();
            document.execCommand('selectAll', false, null);

            updateEdgeType = true;
        }
    });

    $('#btnDeleteEdgeType').click(function() {
        if (selectedEdgeTypeElem != null) {
            var typeid = parseInt(selectedEdgeTypeElem.find('> .typeId').text());
            var typeUsed = false;
            for (var i=0; i<networkGraph.edges.length; i++) {
                if (networkGraph.edges[i].type == typeid) {
                    typeUsed = true;
                    break;
                }
            }

            if (typeUsed) {
                openAlertModal("Deleting edge type is not performed. The edge type is used.", "Cannnot Delete Edge Type")
            } else {
                delete edgeTypes[typeid];

                selectedEdgeTypeElem.remove();
                selectedEdgeTypeElem = null;
                console.log(viewedEdgeTypes);

                if (networkGraph.edgeViewMode == networkGraph.EDGE_VIEW_MODE_SELECTED) {
                    var removingPos = -1;
                    for (var i=0; i<viewedEdgeTypes.length; i++) {
                        if (viewedEdgeTypes[i] == typeid) {
                            removingPos = i;
                            break;
                        }
                    }
                    if (removingPos != -1) {
                        console.log(viewedEdgeTypes);
                        viewedEdgeTypes.splice(removingPos, 1);
                        console.log(viewedEdgeTypes);
                        if (viewedEdgeTypes.length == 0) {
                            viewedEdgeTypes.push(networkGraph.EDGE_TYPE_DEFAULT);
                        }
                        console.log(viewedEdgeTypes);
                        networkGraph.setEdgeViewMode(networkGraph.EDGE_VIEW_MODE_SELECTED, viewedEdgeTypes);
                    }
                }

                $('#btnEditEdgeTypeName').attr('disabled', true);
                $('#btnDeleteEdgeType').attr('disabled', true);
                $('#manageEdgeTypeColorList').css('visibility', 'hidden');

                updateEdgeType = true;
            }
        }
    });

    $('#manageEdgeTypeColorList > .list-group-item').click(function() {
        var color = $(this).data('color');
        $('#manageEdgeTypeColorList > .list-group-item').each(function() {
            $(this).attr('class', 'list-group-item');
        });
        $(this).addClass('active').addClass('type-color-bg')
            .addClass('type-color-text').addClass('type-color-'+color);

        if (selectedEdgeTypeElem != null) {
            var prevColor = selectedEdgeTypeElem.find('> .typeColor').data('color');
            selectedEdgeTypeElem.attr('class', 'list-group-item active');
            selectedEdgeTypeElem.addClass('type-color-bg')
                .addClass('type-color-text').addClass('type-color-' + color);
            selectedEdgeTypeElem.find('> .typeColor').removeClass('type-color-' + prevColor)
                .addClass('type-color-' + color).data('color', color);

            var typeId = parseInt(selectedEdgeTypeElem.find('> .typeId').text());
            edgeTypes[typeId]['color'] = color;
        }
    });
}

function updateManageEdgeTypeUI() {
    $('#manageEdgeTypeList').empty();
    for (var typeid in edgeTypes) {
        $('#manageEdgeTypeList').append("<a class='list-group-item'>"
            + "<span class='edgeTypeName'>" + edgeTypes[typeid]['name'] + "</span>"
            + "<span class='typeColor type-color-bg type-color-" + edgeTypes[typeid]['color']
            + "' data-color='" + edgeTypes[typeid]['color'] + "'>&nbsp;</span>"
            + "<span class='typeId'>" + typeid + "</span></a>");
        var appendedElem = $('#manageEdgeTypeList').find('.list-group-item:last-of-type');
        edgeTypeManageListItemAddClick(appendedElem);
    }
}

function edgeTypeManageListItemAddClick(elem) {
    elem.click(function() {
        if ($(this).hasClass('active')) {   //active->inactive
            selectedEdgeTypeElem = null;
            $(this).find('> .edgeTypeName').blur();
            $(this).attr('class', 'list-group-item');

            $('#btnEditEdgeTypeName').attr('disabled', true);
            $('#btnDeleteEdgeType').attr('disabled', true);
            $('#manageEdgeTypeColorList').css('visibility', 'hidden');
            $('#manageEdgeTypeColorList > .list-group-item').each(function() {
                $(this).attr('class', 'list-group-item');
            });
        } else {    //inactive->active
            selectedEdgeTypeElem = $(this);
            var typeColor = $(this).find('> .typeColor').data('color');
            $('#manageEdgeTypeList > .list-group-item').each(function() {
                $(this).attr('class', 'list-group-item');
            });
            $(this).addClass('active').addClass('type-color-bg')
                .addClass('type-color-text').addClass('type-color-'+typeColor);

            $('#btnEditEdgeTypeName').attr('disabled', false);
            $('#btnDeleteEdgeType').attr('disabled', false);
            $('#manageEdgeTypeColorList').css('visibility', 'visible');
            $('#manageEdgeTypeColorList > .list-group-item').each(function() {
                if ($(this).data('color') == typeColor) {
                    $(this).addClass('active').addClass('type-color-bg')
                        .addClass('type-color-text').addClass('type-color-'+typeColor);
                    $('#manageEdgeTypeColorList').focus();
                    $(this).focus().blur();
                } else {
                    $(this).attr('class', 'list-group-item');
                }
            });
        }
    });
}

function initManageConfidenceUI() {
    $("#manageConfidenceModal .modal-content").draggable({
        handle : ".modal-header",
        containment: "body",
        scroll: false
    });

    //fixed header table reference http://codepen.io/ajkochanowicz/pen/KHdih
    var confidenceTable, fixedTable;
    fixedTable = function (el) {
        var $body, $header, $sidebar;
        $body = $(el).find('.fixedTable-body');
        $sidebar = $(el).find('.fixedTable-sidebar table');
        $header = $(el).find('.fixedTable-header table');
        return $($body).scroll(function () {
            $($sidebar).css('margin-top', -$($body).scrollTop());
            return $($header).css('margin-left', -$($body).scrollLeft());
        });
    };
    confidenceTable = new fixedTable($('#confidenceTable'));

    updateManageConfidenceUI();
}

function updateManageConfidenceUI() {
    //set table from nodetypes
    $('#confidenceTable .fixedTable-header thead tr').empty();
    $('#confidenceTable .fixedTable-sidebar tbody').empty();
    $('#confidenceTable .fixedTable-body tbody').empty();

    var typeList = [];
    for (var typeid in nodeTypes) {
        typeList.push(typeid);
        addNodeTypeConfidence(typeid);
    }
}

function addNodeTypeConfidence(typeid) {
    var nodeType = nodeTypes[typeid];
    var prevTypeIds = [];
    // var prevTypeIds = {};
    $('#confidenceTable .fixedTable-header thead tr th').each(function (idx, elem) {
        prevTypeIds.push(parseInt($(this).data('typeid')));
        // prevTypeIds[idx] = parseInt($(this).data('typeid'));
    });

    $('#confidenceTable .fixedTable-header thead tr').append(
        "<th class='type-color-bg type-color-text type-color-" + nodeType['color']
        + "' data-typeid=" + typeid + ">" + nodeType['name'] + "</th>"
    );

    $('#confidenceTable .fixedTable-sidebar tbody').append(
        "<tr><th class='type-color-bg type-color-text type-color-" + nodeType['color']
        + "' data-typeid=" + typeid + ">" + nodeType['name'] + "</th></tr>"
    );

    /* Input cell */
    $('#confidenceTable .fixedTable-body tbody tr').each(function (idx, elem) {
        var sourceId = prevTypeIds[idx];
        var defaultConfidence = 0.5;
        if (sourceId in nodeConfidences) {
            if (typeid in nodeConfidences[sourceId]) {
                defaultConfidence = nodeConfidences[sourceId][typeid];
            } else {
                nodeConfidences[sourceId][typeid] = defaultConfidence;
            }
        } else {
            nodeConfidences[sourceId] = {};
            nodeConfidences[sourceId][typeid] = defaultConfidence;
        }

        $(elem).append(
            "<td class='td-input'><input type='number' step=0.01 min=0 max=1 "
            + "data-source=" + sourceId + " data-target=" + typeid + " /></td>"
        );

        var appendedElem = $(elem).find('> td:last-of-type');
        appendedElem.find('> input').val(defaultConfidence).blur(function() {
            var sourceId = parseInt($(this).data('source')),
                targetId = parseInt($(this).data('target'));

            var confidence = parseFloat($(this).val()).toFixed(2);
            if(confidence==0)
                confidence = 0;
            $(this).val(confidence);

            if (isNaN(confidence) || !isFinite(confidence)) {
                confidence = 0.5;
                $(this).val(confidence);
            } else if (confidence < 0) {
                confidence = 0;
                $(this).val(confidence);
            } else if (confidence > 1) {
                confidence = 1;
                $(this).val(confidence);
            }
            nodeConfidences[sourceId][targetId] = confidence;
            networkGraph.isChanged = true;
            toggleAskCloseAndRefresh();
        });
    });

    var newRowHtml = "<tr>";
    for (var idx=0; idx<prevTypeIds.length; idx++) {
        var targetId = prevTypeIds[idx];
        var defaultConfidence = 0.5;
        if (typeid in nodeConfidences) {
            if (targetId in nodeConfidences[typeid]) {
                //pass
            } else {
                nodeConfidences[typeid][targetId] = defaultConfidence;
            }
        } else {
            nodeConfidences[typeid] = {};
            nodeConfidences[typeid][targetId] = defaultConfidence;
        }

        newRowHtml += "<td class='td-input'><input type='number' step=0.01 min=0 max=1 "
            + "data-source=" + typeid + " data-target=" + targetId + " /></td>"
    }
    newRowHtml += "<td class='td-empty'></td></tr>"
    $('#confidenceTable .fixedTable-body tbody').append(newRowHtml);
    var appendedElem = $('#confidenceTable .fixedTable-body tbody > tr:last-of-type');
    appendedElem.find('> td > input').each(function (idx, elem) {
        var sourceId = parseInt($(elem).data('source')),
            targetId = parseInt($(elem).data('target'));
        $(this).val(nodeConfidences[sourceId][targetId]);
    });
    appendedElem.find('> td > input').blur(function() {
        var sourceId = parseInt($(this).data('source')),
            targetId = parseInt($(this).data('target'));

        var confidence = parseFloat($(this).val()).toFixed(2);
        if(confidence==0)
            confidence = 0;
        $(this).val(confidence);

        if (isNaN(confidence) || !isFinite(confidence)) {
            confidence = 0.5;
            $(this).val(confidence);
        } else if (confidence < 0) {
            confidence = 0;
            $(this).val(confidence);
        } else if (confidence > 1) {
            confidence = 1;
            $(this).val(confidence);
        }
        nodeConfidences[sourceId][targetId] = confidence;
        networkGraph.isChanged = true;
        toggleAskCloseAndRefresh();
    });
}

function editNodeTypeConfidenceName(typeid) {
    $('#confidenceTable .fixedTable-header thead tr th').each(function (idx, elem) {
        if (typeid == parseInt($(this).data('typeid'))) {
            $(this).attr('class', 'type-color-bg type-color-text')
                .addClass('type-color-' + nodeTypes[typeid]['color'])
                .text(nodeTypes[typeid]['name']);
        }
    });

    var removingSide = null;
    $('#confidenceTable .fixedTable-sidebar tbody tr th').each(function (idx, elem) {
        if (typeid == parseInt($(this).data('typeid'))) {
            $(this).attr('class', 'type-color-bg type-color-text')
                .addClass('type-color-' + nodeTypes[typeid]['color'])
                .text(nodeTypes[typeid]['name']);
        }
    });
}

function deleteNodeTypeConfidence(typeid) {
    var removingHeader = null;
    $('#confidenceTable .fixedTable-header thead tr th').each(function (idx, elem) {
        if (typeid == parseInt($(this).data('typeid'))) {
            removingHeader = $(this);
        }
    });
    removingHeader.remove();

    var removingSide = null;
    $('#confidenceTable .fixedTable-sidebar tbody tr').each(function (idx, elem) {
        if (typeid == parseInt($(this).find('> th').data('typeid'))) {
            removingSide = $(this);
        }
    });
    removingSide.remove();

    var removingRow = null;
    $('#confidenceTable .fixedTable-body tbody tr').each(function (idx, elem) {
        if (typeid == parseInt($(this).find('> td.td-input:first-of-type > input').data('source'))) {
            removingRow = $(this);
        }
    });
    if (removingRow == null) {
        removingRow = $('#confidenceTable .fixedTable-body tbody tr');
    }
    removingRow.remove();

    var removingColumns = [];
    $('#confidenceTable .fixedTable-body tbody tr td').each(function (idx, elem) {
        if (typeid == parseInt($(this).find('> input').data('target'))) {
            removingColumns.push($(this));
        }
    });
    for (var i=0; i<removingColumns.length; i++) {
        removingColumns[i].remove();
    }

    delete nodeConfidences[typeid];
    for (var source in nodeConfidences) {
        delete nodeConfidences[source][typeid];
    }
}

function initManageEdgeTypeViewUI() {
    $("#manageEdgeTypeViewModal .modal-content").draggable({
        handle : ".modal-header",
        containment: "body",
        scroll: false
    });

    $('#manageEdgeTypeViewModal').on('show.bs.modal', function (e) {
        $('#manageEdgeTypeViewList').empty();
        $('#manageEdgeTypeViewList').append("<a class='list-group-item'>"
            + "<span class='edgeTypeName'>" + "Default (No edge type)" + "</span>"
            + "<span class='typeColor type-color-bg type-color-" + networkGraph.EDGE_TYPE_DEFAULT
            + "' data-color='" + networkGraph.EDGE_TYPE_DEFAULT + "'>&nbsp;</span>"
            + "<span class='typeId'>" + networkGraph.EDGE_TYPE_DEFAULT + "</span></a>");
        for (var typeid in edgeTypes) {
            $('#manageEdgeTypeViewList').append("<a class='list-group-item'>"
                + "<span class='edgeTypeName'>" + edgeTypes[typeid]['name'] + "</span>"
                + "<span class='typeColor type-color-bg type-color-" + edgeTypes[typeid]['color']
                + "' data-color='" + edgeTypes[typeid]['color'] + "'>&nbsp;</span>"
                + "<span class='typeId'>" + typeid + "</span></a>");
        }
        $('#manageEdgeTypeViewList').find('.list-group-item').each(function(idx, elem) {
            $(this).off('click').unbind('click').click(function() {
                if ($(this).hasClass('active')) {
                    // if ($('#manageEdgeTypeViewList .list-group-item.active').length == 1) {
                    //     openAlertModal("You must select node types at least one.")
                    // } else {
                    //     $(this).attr('class', 'list-group-item');
                    // }

                    $(this).attr('class', 'list-group-item');
                    if($('#manageEdgeTypeViewList .list-group-item.active').length < (Object.keys(edgeTypes).length + 1)) {
                        $('#checkboxAllEdgeTypeView').prop("checked", false);
                    }
                } else {
                    var typeColor = $(this).find('> .typeColor').data('color');
                    $(this).addClass('active').addClass('type-color-bg')
                        .addClass('type-color-text').addClass('type-color-'+typeColor);
                    if($('#manageEdgeTypeViewList .list-group-item.active').length == (Object.keys(edgeTypes).length + 1)) {
                        $('#checkboxAllEdgeTypeView').prop("checked", true);
                    }
                }
            });
        });
        $('#manageEdgeTypeViewList').find('.list-group-item').each(function(idx, elem) {
            var edgeType = $(this).find('> .typeId').text();
            if (edgeType != networkGraph.EDGE_TYPE_DEFAULT)
                edgeType = parseInt(edgeType);
            if (isIncludeArray(viewedEdgeTypes, edgeType)) {
                var typeColor = $(this).find('> .typeColor').data('color');
                $(this).addClass('active').addClass('type-color-bg')
                    .addClass('type-color-text').addClass('type-color-'+typeColor);
            }
        });
        if($('#manageEdgeTypeViewList .list-group-item.active').length == (Object.keys(edgeTypes).length + 1)) {
            $('#checkboxAllEdgeTypeView').prop("checked", true);
        }
    });
    $('#btnManageEdgeTypeViewModal').click(function () {
        if($('#manageEdgeTypeViewList .list-group-item.active').length < 1) {
            openAlertModal("You must select node types at least one.");
        } else {
            var selectedEdgeTypes = [];
            $('#manageEdgeTypeViewList').find('.list-group-item.active').each(function(idx, elem) {
                var edgeType = $(this).find('> .typeId').text();
                if (edgeType != networkGraph.EDGE_TYPE_DEFAULT)
                    edgeType = parseInt(edgeType);
                selectedEdgeTypes.push(edgeType);
            });
            console.log(selectedEdgeTypes);
            viewedEdgeTypes = selectedEdgeTypes;
            $('#infPathFixedToast').hide(); //end path view
            networkGraph.setEdgeViewMode(networkGraph.EDGE_VIEW_MODE_SELECTED, viewedEdgeTypes);
            setUnselected(true);
            networkGraph.updateGraph();
            $('#manageEdgeTypeViewModal').modal('hide');
        }
    });
    // $('#manageEdgeTypeViewModal').on('hide.bs.modal', function (e) {
    //     var selectedEdgeTypes = [];
    //     $('#manageEdgeTypeViewList').find('.list-group-item.active').each(function(idx, elem) {
    //         var edgeType = $(this).find('> .typeId').text();
    //         if (edgeType != networkGraph.EDGE_TYPE_DEFAULT)
    //             edgeType = parseInt(edgeType);
    //         selectedEdgeTypes.push(edgeType);
    //     });
    //     console.log(selectedEdgeTypes);
    //     viewedEdgeTypes = selectedEdgeTypes;
    //     $('#infPathFixedToast').hide(); //end path view
    //     networkGraph.setEdgeViewMode(networkGraph.EDGE_VIEW_MODE_SELECTED, viewedEdgeTypes);
    //     setUnselected(true);
    //     networkGraph.updateGraph();
    // });
    $('#checkboxAllEdgeTypeView').change(function() {
        if ($(this).is(':checked')) {
            $('#manageEdgeTypeViewList').find('.list-group-item').each(function(idx, elem) {
                $(this).attr('class', 'list-group-item');
                var typeColor = $(this).find('> .typeColor').data('color');
                $(this).addClass('active').addClass('type-color-bg')
                    .addClass('type-color-text').addClass('type-color-' + typeColor);
            });
        } else { // Uncheck 'Show all Edge Types'
            $('#manageEdgeTypeViewList').find('.list-group-item').each(function (idx, elem) {
                $(this).attr('class', 'list-group-item');
            })
        }
    })
}

function initFindMaxInfluencePathUI() {
    $("#findMaxInfPathModal .modal-content").draggable({
        handle : ".modal-header",
        containment: "body",
        scroll: false
    });

    $('#btnFindMaxInfPathConfirm').click(function() {
        if($('#findMaxInfDlgSource').hasClass('unselected')) {
            openAlertModal("Please select source node.");
        } else if($('#findMaxInfDlgTarget').hasClass('unselected')) {
            openAlertModal("Please select target node.");
        } else if(getCheckedBoxNumber($('#findMaxInfPathModal .checkbox_div')) == 0) { // checked box is none.
            openAlertModal("Please select edgetype more than 1.");
        } else if(networkGraph.isChanged) {
            console.log("isChanged");
            openConfirmModal("Before finding max influence path, the graph must be saved. Do you wish to continue?",
                "Save Confirm", function() {
                    $('#findMaxInfPathModal').modal('hide');
                    $.LoadingOverlay('show');
                    var graphJson = generateSaveGraphJson();
                    console.log(graphJson);
                    $.ajax("/graph", {
                        method: 'POST',
                        dataType: 'json',
                        data: JSON.stringify({
                            action: 'save',
                            email: user.email,
                            graph: graphJson
                        }),
                        success: function (res) {
                            console.log(res);
                            if (res['result'] == 'success') {
                                assignSaveIdMaps(res);
                                showSnackBar("Saved");

                                //find max influence path
                                var sourceId = parseInt($('#findMaxInfDlgSource .nodeName').data('nodeid')),
                                    targetId = parseInt($('#findMaxInfDlgTarget .nodeName').data('nodeid'));
                                var sourceNode = networkGraph.getNodeById(sourceId),
                                    targetNode = networkGraph.getNodeById(targetId);
                                var isConfidence = false;
                                if($('#findMaxInfPathModal .checkbox-confidence').is(":checked"))
                                    isConfidence = true;
                                var isAverage = false;
                                if($('#findMaxInfPathModal .checkbox-average').is(":checked"))
                                    isAverage = true;
                                var edgeTypeIdList = [];
                                var edgeTypeNameList = [];
                                $('#findMaxInfPathModal .checkbox_div').each(function (index) {
                                    if ($(this).find('input').is(":checked")) {
                                        var edgeTypeId = $(this).find('> .edgeTypeId').text();
                                        var edgeType = null;
                                        // if (edgeTypeId != 'Default') {
                                        if (edgeTypeId != "null") {
                                            edgeTypeId = parseInt(edgeTypeId);
                                            edgeType = edgeTypes[edgeTypeId];
                                            edgeTypeNameList.push(edgeType.name);
                                        } else {
                                            edgeTypeId = null;
                                            edgeTypeNameList.push("Default");
                                        }
                                        var edgeTypeServerId = null;
                                        if (edgeType != null) edgeTypeServerId = edgeType.serverId;
                                        edgeTypeIdList.push(edgeTypeServerId);
                                    }
                                });

                                $.ajax("/graph", {
                                    method: 'POST',
                                    dataType: 'json',
                                    data: JSON.stringify({
                                        action: 'maxinfluence',
                                        graph_id: nowGraphInfo.graphId,
                                        n1_id: sourceNode.serverId,
                                        n2_id: targetNode.serverId,
                                        edge_type_id_list: edgeTypeIdList,
                                        is_confidence: isConfidence,
                                        is_average: isAverage
                                    }),
                                    success: function (res) {
                                        $.LoadingOverlay('hide');

                                        console.log(res);

                                        //find max influence path
                                        if (res['result'] == 'success') {
                                            if(isAverage == false && (!res['edge_list'] || res['edge_list'].length == 0)) {
                                                openAlertModal("There is NO path from " + sourceNode.title
                                                    + " to " + targetNode.title + ".");
                                            } else if(isAverage == false) {
                                                var edgeServerList = res['edge_list'];
                                                var maxInfValue = res['max_influence_value'];

                                                var nodeServerIdMap = {};
                                                for (var i=0; i<networkGraph.nodes.length; i++) {
                                                    var node = networkGraph.nodes[i];
                                                    nodeServerIdMap[node.serverId] = node.id;
                                                }
                                                var edgeTypeServerIdMap = {};
                                                for (var k in edgeTypes) {
                                                    edgeTypeServerIdMap[edgeTypes[k].serverId] = k;
                                                }
                                                var edgeList = [];
                                                for (var i=0; i<edgeServerList.length; i++) {
                                                    var edgeTypeServer = edgeServerList[i];
                                                    var edgeTypeId = edgeTypeServerIdMap[edgeTypeServer.edge_type_id];
                                                    var sourceId = nodeServerIdMap[edgeTypeServer['n1_id']];
                                                    var targetId = nodeServerIdMap[edgeTypeServer['n2_id']];
                                                    edgeList.push(networkGraph.getEdge(sourceId, targetId, edgeTypeId));
                                                }
                                                console.log(edgeList);

                                                var edgeType = edgeList[0].type; // To show result of edge type.
                                                var edgeTypeName = 'Default';
                                                if (edgeType != null) edgeTypeName = edgeTypes[edgeType].name;

                                                setUnselected(true);
                                                closeAnalysisToast();
                                                infPathToast(sourceNode.title, targetNode.title, maxInfValue, edgeTypeName, edgeList, edgeTypeNameList, isConfidence, isAverage);
                                                console.log(edgeList);
                                                networkGraph.setEdgeViewMode(networkGraph.EDGE_VIEW_MODE_PATH, edgeList);
                                            } else { // isAverage == true
                                                var averageValue = res['max_influence_average_value'];
                                                setUnselected(true);
                                                closeAnalysisToast();
                                                console.log(sourceNode);
                                                var infoHtml = "Max Influence Average from &lt;" + sourceNode.title
                                                    + "&gt; to &lt;" + targetNode.title + "&gt; <br/>"
                                                    + "Max Influence Average Value: " + averageValue;

                                                $('#infPathFixedInfo').html(infoHtml);
                                                $('#infPathFixedToast').show();
                                                $('#infPathFixedToast .toast-alert').draggable({
                                                    containment: "#graph",
                                                    scroll: false
                                                });
                                            }
                                        } else {
                                            openAlertModal(res['message'], 'Find Max Influence Path Failure');
                                        }
                                        networkGraph.isChanged = false;
                                        toggleAskCloseAndRefresh();
                                    }, error: function (xhr, status, error) {
                                        console.log(xhr);
                                        $.LoadingOverlay('hide');
                                        $('#findMaxInfPathModal').modal('hide');
                                        openAlertModal(xhr.statusText, 'Find Max Influence Path Failure');
                                        networkGraph.isChanged = false;
                                        toggleAskCloseAndRefresh();
                                    }
                                });
                            } else {
                                $.LoadingOverlay('hide');
                                $('#findMaxInfPathModal').modal('hide');
                                openAlertModal(res['message'], 'Save Graph Failure');
                                networkGraph.isChanged = false;
                                toggleAskCloseAndRefresh();
                            }
                        }, error: function (xhr, status, error) {
                            console.log(xhr);
                            $.LoadingOverlay('hide');
                            $('#findMaxInfPathModal').modal('hide');
                            openAlertModal(xhr.statusText, 'Save Graph Failure');
                            networkGraph.isChanged = false;
                            toggleAskCloseAndRefresh();
                        }
                    });
                });
            networkGraph.isChanged = false;
            toggleAskCloseAndRefresh();
        } else {
            $('#findMaxInfPathModal').modal('hide');
            $.LoadingOverlay('show');

            //find max influence path
            var sourceId = parseInt($('#findMaxInfDlgSource .nodeName').data('nodeid')),
                targetId = parseInt($('#findMaxInfDlgTarget .nodeName').data('nodeid'));
            var sourceNode = networkGraph.getNodeById(sourceId),
                targetNode = networkGraph.getNodeById(targetId);
            var isConfidence = false;
            if($('#findMaxInfPathModal .checkbox-confidence').is(":checked"))
                isConfidence = true;
            var isAverage = false;
            if($('#findMaxInfPathModal .checkbox-average').is(":checked"))
                isAverage = true;
            var edgeTypeIdList = [];
            var edgeTypeNameList = [];
            $('#findMaxInfPathModal .checkbox_div').each(function (index) {
                if ($(this).find('input').is(":checked")) {
                    var edgeTypeId = $(this).find('> .edgeTypeId').text();
                    var edgeType = null;
                    if (edgeTypeId != 'null') {
                        edgeTypeId = parseInt(edgeTypeId);
                        edgeType = edgeTypes[edgeTypeId];
                        edgeTypeNameList.push(edgeType.name);
                    } else {
                        edgeTypeId = null;
                        edgeTypeNameList.push("Default");
                    }
                    var edgeTypeServerId = null;
                    if (edgeType != null) edgeTypeServerId = edgeType.serverId;
                    edgeTypeIdList.push(edgeTypeServerId);
                }
            });

            $.ajax("/graph", {
                method: 'POST',
                dataType: 'json',
                data: JSON.stringify({
                    action: 'maxinfluence',
                    graph_id: nowGraphInfo.graphId,
                    n1_id: sourceNode.serverId,
                    n2_id: targetNode.serverId,
                    edge_type_id_list: edgeTypeIdList,
                    is_confidence: isConfidence,
                    is_average: isAverage
                }),
                success: function (res) {
                    $.LoadingOverlay('hide');
                    $('#findMaxInfPathModal').modal('hide');
                    console.log(res);

                    //find max influence path
                    if (res['result'] == 'success') {
                        if(isAverage == false && (!res['edge_list'] || res['edge_list'].length == 0)) {
                            openAlertModal("There is NO path from " + sourceNode.title
                                + " to " + targetNode.title + ".");
                        } else if (isAverage == false) {
                            var edgeServerList = res['edge_list'];
                            var maxInfValue = res['max_influence_value'];

                            var nodeServerIdMap = {};
                            for (var i=0; i<networkGraph.nodes.length; i++) {
                                var node = networkGraph.nodes[i];
                                nodeServerIdMap[node.serverId] = node.id;
                            }
                            var edgeTypeServerIdMap = {};
                            for (var k in edgeTypes) {
                                edgeTypeServerIdMap[edgeTypes[k].serverId] = k;
                            }
                            var edgeList = [];
                            for (var i=0; i<edgeServerList.length; i++) {
                                var edgeTypeServer = edgeServerList[i];
                                var edgeTypeId = edgeTypeServerIdMap[edgeTypeServer.edge_type_id];
                                var sourceId = nodeServerIdMap[edgeTypeServer['n1_id']];
                                var targetId = nodeServerIdMap[edgeTypeServer['n2_id']];
                                edgeList.push(networkGraph.getEdge(sourceId, targetId, edgeTypeId));
                            }
                            var edgeType = edgeList[0].type;

                            setUnselected(true);
                            var edgeTypeName = 'Default';
                            if (edgeType != null) edgeTypeName = edgeTypes[edgeType].name;
                            closeAnalysisToast();
                            infPathToast(sourceNode.title, targetNode.title, maxInfValue, edgeTypeName, edgeList, edgeTypeNameList, isConfidence, isAverage);
                            console.log(edgeList);
                            networkGraph.setEdgeViewMode(networkGraph.EDGE_VIEW_MODE_PATH, edgeList);
                        } else { // isAverage == true
                            var averageValue = res['max_influence_average_value'];
                            setUnselected(true);
                            closeAnalysisToast();
                            console.log(sourceNode);
                            var infoHtml = "Max Influence Average from &lt;" + sourceNode.title
                                + "&gt; to &lt;" + targetNode.title + "&gt; <br/>";

                            infoHtml += "Confidence : ";
                            if(isConfidence)
                                infoHtml += "O <br/>";
                            else
                                infoHtml += "X <br/>";

                            infoHtml += "Average : ";
                            if(isAverage)
                                infoHtml += "O <br/>";
                            else
                                infoHtml += "X <br/>";

                            infoHtml += "Edge Type : ";
                            for (var i = 0; i < edgeTypeNameList.length; i++) {
                                infoHtml += edgeTypeNameList[i];
                                if(i != edgeTypeNameList.length-1)
                                    infoHtml += ', ';
                                else
                                    infoHtml += "<br/>";
                            }

                            infoHtml += "Max Influence Average Value: " + averageValue;

                            $('#infPathFixedInfo').html(infoHtml);
                            $('#infPathFixedToast').show();
                            $('#infPathFixedToast .toast-alert').draggable({
                                containment: "#graph",
                                scroll: false
                            });
                        }
                    } else {
                        openAlertModal(res['message'], 'Find Max Influence Path Failure');
                    }
                    networkGraph.isChanged = false;
                    toggleAskCloseAndRefresh();
                }, error: function (xhr, status, error) {
                    console.log(xhr);
                    $.LoadingOverlay('hide');
                    $('#findMaxInfPathModal').modal('hide');
                    openAlertModal(xhr.statusText, 'Find Max Influence Path Failure');
                    networkGraph.isChanged = false;
                    toggleAskCloseAndRefresh();
                }
            });
            networkGraph.isChanged = false;
            toggleAskCloseAndRefresh();
        }
    });
    $('#findMaxInfPathModal').on('show.bs.modal', function (e) {
        $('#findMaxInfDlgSource').addClass('unselected').html("Select Source Node");
        $('#findMaxInfDlgTarget').addClass('unselected').html("Select Target Node");
        $('.findMaxInfDlgNodeDropdown').empty();
        for (var i=0; i<networkGraph.nodes.length; i++) {
            var nodeData = networkGraph.nodes[i];
            var nodeInfoHtml = "<li><a>" + nodeDataToSubMenuHtml(nodeData) + "</a></li>";
            $('.findMaxInfDlgNodeDropdown').append(nodeInfoHtml);
        }
        $('#findMaxInfDlgSourceDropdown > li > a').off('click').unbind('click').click(function() {
            var selItem = $(this);
            $('#findMaxInfDlgSource').removeClass('unselected').html(selItem.html());
        });
        $('#findMaxInfDlgTargetDropdown > li > a').off('click').unbind('click').click(function() {
            var selItem = $(this);
            $('#findMaxInfDlgTarget').removeClass('unselected').html(selItem.html());
        });

        addCheckbox('#findMaxInfPathModal');
    });
    $('#findMaxInfPathModal').on('hide.bs.modal', function (e) {
        $('.findMaxInfDlgNodeDropdown').empty();
        $('#findMaxInfDlgEdgeTypeDropdown').empty();
    });

    $('#infPathFixedToast .close').click(function() {
        networkGraph.setEdgeViewMode(networkGraph.EDGE_VIEW_MODE_SELECTED, viewedEdgeTypes);
        $('#infPathFixedToast').hide();
    });
}

function initMaxInfluenceTableUI() {
    $("#findAllMaxInfModal .modal-content").draggable({
        handle : ".modal-header",
        containment: "body",
        scroll: false
    });

    $('#btnFindAllMaxInfConfirm').click(function() {
        if(getCheckedBoxNumber($('#findAllMaxInfModal .checkbox_div')) == 0) { // checked box is none.
            openAlertModal("Please select edgetype more than 1.");
        } else if(networkGraph.isChanged) {
            console.log("isChanged");
            openConfirmModal("Before finding max influence path, the graph must be saved. Do you wish to continue?",
                "Save Confirm", function() {
                    $.LoadingOverlay('show');

                    var graphJson = generateSaveGraphJson();
                    console.log(graphJson);
                    $.ajax("/graph", {
                        method: 'POST',
                        dataType: 'json',
                        data: JSON.stringify({
                            action: 'save',
                            email: user.email,
                            graph: graphJson
                        }),
                        success: function (res) {
                            console.log(res);
                            if (res['result'] == 'success') {
                                assignSaveIdMaps(res);

                                showSnackBar("Saved");

                                /* find all max influence */
                                var isConfidence = false;
                                if($('#findAllMaxInfModal .checkbox-confidence').is(":checked"))
                                    isConfidence = true;
                                var isAverage = false;
                                if($('#findAllMaxInfModal .checkbox-average').is(":checked"))
                                    isAverage = true;
                                var edgeTypeIdList = [];
                                $('#findAllMaxInfModal .checkbox_div').each(function (index) {
                                    if ($(this).find('input').is(":checked")) {
                                        var edgeTypeId = $(this).find('> .edgeTypeId').text();
                                        var edgeType = null;
                                        if (edgeTypeId != 'Default') {
                                            edgeTypeId = parseInt(edgeTypeId);
                                            edgeType = edgeTypes[edgeTypeId];
                                        } else edgeTypeId = null;
                                        var edgeTypeServerId = null;
                                        if (edgeType != null) edgeTypeServerId = edgeType.serverId;
                                        edgeTypeIdList.push(edgeTypeServerId);
                                    }
                                });
                                $('#findAllMaxInfModal').modal('hide');
                                $.ajax("/graph", {
                                    method: 'POST',
                                    dataType: 'json',
                                    data: JSON.stringify({
                                        action: 'allmaxinfluence',
                                        graph_id: nowGraphInfo.graphId,
                                        edge_type_id_list: edgeTypeIdList,
                                        is_confidence: isConfidence,
                                        is_average: isAverage
                                    }),
                                    success: function (res) {
                                        $.LoadingOverlay('hide');

                                        console.log(res);
                                        // add exception handling about result
                                        var maxInfluenceList = res['max_influence_list'];
                                        var nodeSet = res['node_set'];
                                        setUnselected(true);
                                        closeAnalysisToast();
                                        allMaxInfToast(maxInfluenceList, nodeSet);
                                        networkGraph.isChanged = false;
                                        toggleAskCloseAndRefresh();
                                    }, error: function (xhr, status, error) {
                                        console.log(xhr);
                                        $.LoadingOverlay('hide');
                                        $('#findMaxInfPathModal').modal('hide');
                                        openAlertModal(xhr.statusText, 'Find Max Influence Path Failure');
                                        networkGraph.isChanged = false;
                                        toggleAskCloseAndRefresh();
                                    }
                                });
                            } else {
                                $.LoadingOverlay('hide');
                                $('#findAllMaxInfModal').modal('hide');
                                openAlertModal(res['message'], 'Save Graph Failure');
                                networkGraph.isChanged = false;
                                toggleAskCloseAndRefresh();
                            }
                        }, error: function (xhr, status, error) {
                            console.log(xhr);
                            $.LoadingOverlay('hide');
                            $('#findAllMaxInfModal').modal('hide');
                            openAlertModal(xhr.statusText, 'Save Graph Failure');
                            networkGraph.isChanged = false;
                            toggleAskCloseAndRefresh();
                        }
                    });
                });
            networkGraph.isChanged = false;
            toggleAskCloseAndRefresh();
        } else {

            /* find all max influence */
            var isConfidence = false;
            if($('#findAllMaxInfModal .checkbox-confidence').is(":checked"))
                isConfidence = true;
            var isAverage = false;
            if($('#findAllMaxInfModal .checkbox-average').is(":checked"))
                isAverage = true;
            var edgeTypeIdList = [];
            $('#findAllMaxInfModal .checkbox_div').each(function (index) {
                if ($(this).find('input').is(":checked")) {
                    var edgeTypeId = $(this).find('> .edgeTypeId').text();
                    var edgeType = null;
                    if (edgeTypeId != 'Default') {
                        edgeTypeId = parseInt(edgeTypeId);
                        edgeType = edgeTypes[edgeTypeId];
                    } else edgeTypeId = null;
                    var edgeTypeServerId = null;
                    if (edgeType != null) edgeTypeServerId = edgeType.serverId;
                    edgeTypeIdList.push(edgeTypeServerId);
                }
            });

            $.LoadingOverlay('show');
            $('#findAllMaxInfModal').modal('hide');

            $.ajax("/graph", {
                method: 'POST',
                dataType: 'json',
                data: JSON.stringify({
                    action: 'allmaxinfluence',
                    graph_id: nowGraphInfo.graphId,
                    edge_type_id_list: edgeTypeIdList,
                    is_confidence: isConfidence,
                    is_average: isAverage
                }),
                success: function (res) {
                    $.LoadingOverlay('hide');
                    $('#findAllMaxInfModal').modal('hide');
                    console.log(res);
                    // add exception handling about result
                    var maxInfluenceList = res['max_influence_list'];
                    var nodeSet = res['node_set'];
                    setUnselected(true);
                    closeAnalysisToast();
                    allMaxInfToast(maxInfluenceList, nodeSet);
                    networkGraph.isChanged = false;
                    toggleAskCloseAndRefresh();
                }, error: function (xhr, status, error) {
                    console.log(xhr);
                    $.LoadingOverlay('hide');
                    $('#findAllMaxInfModal').modal('hide');
                    openAlertModal(xhr.statusText, 'Find Max Influence Path Failure');
                    networkGraph.isChanged = false;
                    toggleAskCloseAndRefresh();
                }
            });
            networkGraph.isChanged = false;
            toggleAskCloseAndRefresh();
        }
    });
    $('#findAllMaxInfModal').on('show.bs.modal', function (e) {
        addCheckbox('#findAllMaxInfModal');
    });
    $('#findAllMaxInfModal').on('hide.bs.modal', function (e) {
        $('.edgetype-checkbox-group').empty();
    });
    $('#maxInfluenceTable .close').click(function() {
        $('#maxInfluenceTable').hide();
    });
    var initialWidth = 0, initialHeight = 0;
    $('#maxInfluenceTable .maximize').click(function () {
        if($('#maxInfluenceTable').hasClass('maximized')==false) {
            initialWidth = $('#maxInfluenceTable .toa' +
                'st-wrapper .toast-alert .toast-body').width();
            initialHeight = $('#maxInfluenceTable .toa' +
                'st-wrapper .toast-alert .toast-body').height();
            $('#maxInfluenceTable').addClass('maximized');
            $('#maxInfluenceTable').css('left', '240px').css('top', '61px');
            $('#maxInfluenceTable .toa' +
                'st-wrapper .toast-alert .toast-body').css('width', '100%');
            $('#maxInfluenceTable .toa' +
                'st-wrapper .toast-alert .toast-body').css('height', '90vh');
            $('#maxInfluenceTable .toast-wrapper').css('width', '100%');
            $('#maxInfluenceTable .toast-wrapper').css('max-width', '100%');
            $('#maxInfluenceTable .maximize span').text('▣');
        } else {
            console.log(initialWidth + "/" + initialHeight);
            $('#maxInfluenceTable').removeClass('maximized');
            $('#maxInfluenceTable').css('left', '240px').css('top', '61px');
            $('#maxInfluenceTable .toa' +
                'st-wrapper .toast-alert .toast-body').css('width', initialWidth);
            $('#maxInfluenceTable .toa' +
                'st-wrapper .toast-alert .toast-body').css('height', initialHeight);
            $('#maxInfluenceTable .toast-wrapper').css('width', initialWidth);
            $('#maxInfluenceTable .toast-wrapper').css('max-width', '480px');
            $('#maxInfluenceTable .maximize span').text('□');
        }

    });
}

function getCheckedBoxNumber(id) {
    var number = 0;
    id.each(function (index) {
        if ($(this).find('input').is(":checked")) {
            number++;
        }
    });
    return number;
}

function addCheckbox(id) {
    $('.edgetype-checkbox-group').empty();
    $('.edgetype-checkbox-group').append("<div class='checkbox_div'><input type=\"checkbox\" checked>" + edgeTypeToSubMenuHtml(null) + "</div>");
    for (var tid in edgeTypes) {
        $('.edgetype-checkbox-group').append("<div class='checkbox_div'><input type=\"checkbox\" checked>" + edgeTypeToSubMenuHtml(tid) + "</div>");
    }

    if (edgeTypes[0] == undefined) {
        $(id + ' .edgetype-div2').hide();
    } else {
        $(id + ' .edgetype-div2').show();
        $(id + ' .checkbox-all').click(function () {
            if ($(this).is(':checked')) {
                $(id +' .checkbox_div input').each(function () {
                    if ($(this).is(':checked') == false) {
                        $(this).prop('checked', true);
                    }
                });
            } else {
                $(id + ' .checkbox_div input').each(function () {
                    if ($(this).is(':checked') == true) {
                        $(this).prop('checked', false);
                    }
                });
            }
        });
    }

    var boxNum = 0;
    var checkedboxNum = 0;

    $(id + ' .checkbox_div input').each(function () {
        $(this).click(function () {

            console.log("click");
            $(id + ' .checkbox_div input').each(function () {
                boxNum++;
                if($(this).is(':checked') == true) {
                    checkedboxNum++;
                }
            });
            console.log("bn" + boxNum);
            console.log("cbn" + checkedboxNum);
            if((boxNum == checkedboxNum) && ($(id + ' .checkbox-all').is(':checked') == false)) {
                $(id + ' .checkbox-all').prop('checked', true);
            } else if ((boxNum != checkedboxNum) && ($(id + ' .checkbox-all').is(':checked') == true)) {
                $(id + ' .checkbox-all').prop('checked', false);
            }
            boxNum = 0;
            checkedboxNum = 0;
        });
    });
    $(id + ' .checkbox-all').prop('checked', true);
    $(id + ' .checkbox-average').prop('checked', false);
}

function initFindMostInfluenceNodeUI(type) {
    $('#findMost' + type + 'InfNodeModal' + " .modal-content").draggable({
        handle : ".modal-header",
    containment: "body",
        scroll: false
});

    $('#btnFind' + type + 'InfNodeConfirm').click(function() {
        if($('#most' + type + 'InfNodeNumber').val() == "") {
            openAlertModal("Please input the number of node.");
        } else if(getCheckedBoxNumber($('#findMost' + type + 'InfNodeModal' + ' .checkbox_div')) == 0) { // checked box is none.
            openAlertModal("Please select edgetype more than 1.");
        } else if(networkGraph.isChanged) {
            openConfirmModal("Before finding max influence path, the graph must be saved. Do you wish to continue?",
                "Save Confirm", function() {
                    $.LoadingOverlay('show');
                    var graphJson = generateSaveGraphJson();
                    console.log(graphJson);
                    $.ajax("/graph", {
                        method: 'POST',
                        dataType: 'json',
                        data: JSON.stringify({
                            action: 'save',
                            email: user.email,
                            graph: graphJson
                        }),
                        success: function (res) {
                            console.log(res);
                            if (res['result'] == 'success') {
                                assignSaveIdMaps(res);
                                showSnackBar("Saved");

                                var nodeNumber = $('#most' + type + 'InfNodeNumber').val();
                                var isConfidence = false;
                                if($('#findMost' + type + 'InfNodeModal' + ' .checkbox-confidence').is(":checked"))
                                    isConfidence = true;
                                var isAverage = false;
                                if($('#findMost' + type + 'InfNodeModal' + ' .checkbox-average').is(":checked"))
                                    isAverage = true;
                                var edgeTypeIdList = [];
                                var edgeTypeNameList = [];
                                $('#findMost' + type + 'InfNodeModal' + ' .checkbox_div').each(function (index) {
                                    if ($(this).find('input').is(":checked")) {
                                        var edgeTypeId = $(this).find('> .edgeTypeId').text();
                                        var edgeType = null;
                                        if (edgeTypeId != 'Default') {
                                            edgeTypeId = parseInt(edgeTypeId);
                                            edgeType = edgeTypes[edgeTypeId];
                                            edgeTypeNameList.push(edgeType.name);
                                        } else {
                                            edgeTypeId = null;
                                            edgeTypeNameList.push("Default");
                                        }

                                        var edgeTypeServerId = null;
                                        if (edgeType != null) edgeTypeServerId = edgeType.serverId;
                                        edgeTypeIdList.push(edgeTypeServerId);
                                    }
                                });

                                $.ajax("/graph", {
                                    method: 'POST',
                                    dataType: 'json',
                                    data: JSON.stringify({
                                        action: 'most' + type.toLowerCase() + 'infnode',
                                        graph_id: nowGraphInfo.graphId,
                                        num : nodeNumber,
                                        edge_type_id_list: edgeTypeIdList,
                                        is_confidence: isConfidence,
                                        is_average: isAverage
                                    }),
                                    success: function (res) {
                                        $.LoadingOverlay('hide');
                                        $('#findMost' + type + 'InfNodeModal').modal('hide');
                                        console.log(res);

                                        if (res['result'] == 'success') {
                                            var nodeServerList = res['node_list'];
                                            var nodeServerIdMap = {}; // 서버아이디에 대응되는 노드아이디를 저장하는 맵. 노드리스트를 초기화 하기위해 만듬.
                                            for (var i=0; i < networkGraph.nodes.length; i++) {
                                                var node = networkGraph.nodes[i];
                                                nodeServerIdMap[node.serverId] = node.id;
                                            }
                                            var nodeList = []; // 최종 결과 노드 리스트.
                                            for(var i=0; i < nodeServerList.length; i++) {
                                                var nodeServerId = nodeServerList[i]['node_id'];
                                                var node = {};
                                                node['node'] = networkGraph.getNodeById(nodeServerIdMap[nodeServerId]);
                                                node[type.toLowerCase() + '_influence_value'] = nodeServerList[i][type.toLowerCase() + '_influence_value'];
                                                nodeList.push(node);
                                            }
                                            setUnselected(true);
                                            closeAnalysisToast(); // 새로운 토스트를 열기전에 이전의 토스트를 다 닫는다.

                                            maxInfNodeToast(type, nodeList, edgeTypeNameList, isConfidence, isAverage);
                                            console.log(nodeList);
                                            // networkGraph.setEdgeViewMode(networkGraph.EDGE_VIEW_MODE_PATH, edgeList);
                                        } else {
                                            openAlertModal(res['message'], 'Find Most ' + type + ' Influence Node Failure');
                                        }
                                        networkGraph.isChanged = false;
                                        toggleAskCloseAndRefresh();
                                    }, error: function (xhr, status, error) {
                                        console.log(xhr);
                                        $.LoadingOverlay('hide');
                                        $('#findMost' + type + 'InfNodeModal').modal('hide');
                                        openAlertModal(xhr.statusText, 'Find Most ' + type + ' Influence Node Failure');
                                        networkGraph.isChanged = false;
                                        toggleAskCloseAndRefresh();
                                    }
                                });
                            } else {
                                $.LoadingOverlay('hide');
                                $('#findMost' + type + 'InfNodeModal').modal('hide');
                                openAlertModal(res['message'], 'Save Graph Failure');
                                networkGraph.isChanged = false;
                                toggleAskCloseAndRefresh();
                            }
                        }, error: function (xhr, status, error) {
                            console.log(xhr);
                            $.LoadingOverlay('hide');
                            $('#findMost' + type + 'InfNodeModal').modal('hide');
                            openAlertModal(xhr.statusText, 'Save Graph Failure');
                            networkGraph.isChanged = false;
                            toggleAskCloseAndRefresh();
                        }
                    });
                });
            networkGraph.isChanged = false;
            toggleAskCloseAndRefresh();
        } else {
            var nodeNumber = $('#most' + type + 'InfNodeNumber').val();
            var isConfidence = false;
            if($('#findMost' + type + 'InfNodeModal' + ' .checkbox-confidence').is(":checked"))
                isConfidence = true;
            var isAverage = false;
            if($('#findMost' + type + 'InfNodeModal' + ' .checkbox-average').is(":checked"))
                isAverage = true;
            var edgeTypeIdList = [];
            var edgeTypeNameList = [];
            $('#findMost' + type + 'InfNodeModal' + ' .checkbox_div').each(function (index) {
                if ($(this).find('input').is(":checked")) {
                    var edgeTypeId = $(this).find('> .edgeTypeId').text();
                    var edgeType = null;
                    if (edgeTypeId != "null") {
                        edgeTypeId = parseInt(edgeTypeId);
                        edgeType = edgeTypes[edgeTypeId];
                        edgeTypeNameList.push(edgeType.name);
                    } else {
                        edgeTypeId = null;
                        edgeTypeNameList.push("Default");
                    }
                    var edgeTypeServerId = null;
                    if (edgeType != null) edgeTypeServerId = edgeType.serverId;
                    edgeTypeIdList.push(edgeTypeServerId);
                }
            });

            $.ajax("/graph", {
                method: 'POST',
                dataType: 'json',
                data: JSON.stringify({
                    action: 'most' + type.toLowerCase() + 'infnode',
                    graph_id: nowGraphInfo.graphId,
                    num : nodeNumber,
                    edge_type_id_list: edgeTypeIdList,
                    is_confidence: isConfidence,
                    is_average: isAverage
                }),
                success: function (res) {
                    $.LoadingOverlay('hide');
                    $('#findMost' + type + 'InfNodeModal').modal('hide');
                    console.log(res);

                    if (res['result'] == 'success') {
                        var nodeServerList = res['node_list'];
                        var nodeServerIdMap = {}; // 서버아이디에 대응되는 노드아이디를 저장하는 맵. 노드리스트를 초기화 하기위해 만듬.
                        for (var i=0; i < networkGraph.nodes.length; i++) {
                            var node = networkGraph.nodes[i];
                            nodeServerIdMap[node.serverId] = node.id;
                        }
                        var nodeList = []; // 최종 결과 노드 리스트.
                        for(var i=0; i < nodeServerList.length; i++) {
                            var nodeServerId = nodeServerList[i]['node_id'];
                            var node = {};
                            node['node'] = networkGraph.getNodeById(nodeServerIdMap[nodeServerId]);
                            node[type.toLowerCase() + '_influence_value'] = nodeServerList[i][type.toLowerCase() + '_influence_value'];
                            nodeList.push(node);
                        }
                        setUnselected(true);
                        closeAnalysisToast(); // 새로운 토스트를 열기전에 이전의 토스트를 다 닫는다.
                        maxInfNodeToast(type, nodeList, edgeTypeNameList, isConfidence, isAverage);
                        console.log(nodeList);
                        // networkGraph.setEdgeViewMode(networkGraph.EDGE_VIEW_MODE_PATH, edgeList);
                    } else {
                        openAlertModal(res['message'], 'Find Most ' + type + ' Influence Node Failure');
                    }
                    networkGraph.isChanged = false;
                    toggleAskCloseAndRefresh();
                }, error: function (xhr, status, error) {
                    console.log(xhr);
                    $.LoadingOverlay('hide');
                    $('#findMost' + type + 'InfNodeModal').modal('hide');
                    openAlertModal(xhr.statusText, 'Find Most ' + type + ' Influence Node Failure');
                    networkGraph.isChanged = false;
                    toggleAskCloseAndRefresh();
                }
            });
            networkGraph.isChanged = false;
            toggleAskCloseAndRefresh();
        }
    });


    $('#findMost' + type + 'InfNodeModal').on('show.bs.modal', function (e) {
        $('#most' + type + 'InfNodeNumber').val(1);
        addCheckbox('#findMost' + type + 'InfNodeModal');
        $('#most' + type + 'InfNodeNumber').attr({'max' : networkGraph.nodes.length});
    });
    // $('#findMost' + type + 'InfNodeModal').on('hide.bs.modal', function (e) {
    //     $('#find' + type + 'InfDlgEdgeTypeDropdown').empty();
    // });
    $('#' + type.toLowerCase() + 'InfNodeFixedToast .close').click(function() {
        $('#' + type.toLowerCase() + 'InfNodeFixedToast').hide();
    });
}

function closeAnalysisToast() {
    networkGraph.setEdgeViewMode(networkGraph.EDGE_VIEW_MODE_SELECTED, viewedEdgeTypes);
    $('#maxInfluenceTable').hide();
    $('#infPathFixedToast').hide();
    $('#sumInfNodeFixedToast').hide();
    $('#avgInfNodeFixedToast').hide();
}

function menuFindMaxInfluence() {
    if (networkGraph.nodes.length < 2) {
        openAlertModal("Finding max influence path can be performed when there are more than two nodes.");
    } else {
        $('#findMaxInfPathModal').modal('show');
    }
}

function menuFindMostSumInfluence() {
    if (networkGraph.nodes.length < 2) {
        openAlertModal("Finding max sum influence nodes can be performed when there are more than two nodes.");
    } else {
        $('#findMostSumInfNodeModal').modal('show');
    }
}

function menuFindMostAverageInfluence() {
    if (networkGraph.nodes.length < 2) {
        openAlertModal("Finding max average influence nodes can be performed when there are more than two nodes.");
    } else {
        $('#findMostAvgInfNodeModal').modal('show');
    }
}

function menuFindMaxInfluenceTable() {
    if (networkGraph.nodes.length < 2) {
        openAlertModal("Finding max influence path can be performed when there are more than two nodes.");
    } else {

        // $('#maxInfTableFixedToast').show();
        $('#findAllMaxInfModal').modal('show');
        // var popUrl = "max_influence_table.jsp";
        // var popOption = "width=500, height=500, resizable=no, scrollbars=no, status=no, location=no;";
        // window.open(popUrl,"",popOption);
    }
}

function infPathToast(node1Name, node2Name, infValue, edgeTypeName, edgeList, edgeTypeNameList, isConfidence, isAverage) {

    // var data = '<div id="maxInfluenceToast"></div>';
    //
    // $.dialogbox({
    //     type:'default',
    //     title:'MaxInfluence',
    //     content: data,
    //     width : 300,
    //     height : 300,
    //     top : '80px',
    //     left : '265px',
    //     padding : '10px',
    //     closeCallback : function(){
    //         setUnselected(true);
    //     }
    // });

    var infoHtml = "Max Influence Path &lt;" + node1Name
    + "&gt; ▶ &lt;" + node2Name + "&gt; <br/>";
;
    infoHtml += "Options <br/>";
    infoHtml += "- Confidence : ";
    if(isConfidence)
        infoHtml += "O <br/>";
    else
        infoHtml += "X <br/>";

    infoHtml += "- Average : ";
    if(isAverage)
        infoHtml += "O <br/>";
    else
        infoHtml += "X <br/>";

    infoHtml += "- Edge Type : ";
    for (var i = 0; i < edgeTypeNameList.length; i++) {
        infoHtml += edgeTypeNameList[i];
        if(i != edgeTypeNameList.length-1)
            infoHtml += ', ';
        else
            infoHtml += "<br/>";
    }

    infoHtml += "Results <br/>";
    infoHtml += "- Max Influence Value: " + infValue
    + "<br/>- Path's edge type: " + edgeTypeName
    + "<br/>" + "- Path" + ": ";

    for (var i = 0; i < edgeList.length; i++) {
        if (i==0) {
            infoHtml += edgeList[i].source.title;
            infoHtml += " ▶ ";
            infoHtml += edgeList[i].target.title;
        } else {
            infoHtml += " ▶ ";
            infoHtml += edgeList[i].target.title;
        }
    }

    // $('#maxInfluenceToast').html(infoHtml);
    $('#infPathFixedInfo').html(infoHtml);
    $('#infPathFixedToast').show();
    $('#infPathFixedToast .toast-alert').draggable({
        containment: "#graph",
        scroll: false
    }).resizable();
}

function maxInfNodeToast(type, nodeList, edgeTypeNameList, isConfidence, isAverage) {
    // var data = '<div id="maxInfNodeToast"></div>';
    //
    // $.dialogbox({
    //     type:'default',
    //     title: "Most " + type + " Influence Node",
    //     content: data,
    //     width : 300,
    //     height : 300,
    //     top : '80px',
    //     left : '265px',
    //     padding : '10px'
    // });

    var infoHtml = "Most " + type + " Influence Node <br/>";
    infoHtml += "Options <br/>";
    infoHtml += "- The number of node : " + nodeList.length + "<br/>";

    infoHtml += "- Edge Type : ";
    for (var i = 0; i < edgeTypeNameList.length; i++) {
        infoHtml += edgeTypeNameList[i];
        if(i != edgeTypeNameList.length-1)
            infoHtml += ', ';
        else
            infoHtml += "<br/>";
    }

    infoHtml += "- Confidence : ";
    if(isConfidence)
        infoHtml += "O <br/>";
    else
        infoHtml += "X <br/>";

    infoHtml += "- Average : ";
    if(isAverage)
        infoHtml += "O <br/>";
    else
        infoHtml += "X <br/>";

    console.log(edgeTypeNameList);
    console.log(nodeList);
    infoHtml += "Results <br/>";
    for (var i = 0; i < nodeList.length; i++) {
        infoHtml += i+1 + ". ";
        infoHtml += "node : " + nodeList[i].node.title + "&nbsp&nbsp value : " + nodeList[i][type.toLowerCase() + '_influence_value'];
        infoHtml += "<br/>";
    }
    // $('#maxInfNodeToast').html(infoHtml);
    $('#' + type.toLowerCase() + 'InfNodeFixedInfo').html(infoHtml);
    $('#' + type.toLowerCase() + 'InfNodeFixedToast').show();
    $('#' + type.toLowerCase() + 'InfNodeFixedToast .toast-alert').draggable({
        containment: "#graph",
        scroll: false
    });
}

function allMaxInfToast(maxInfluenceList, nodeSet) {
    // var data = '<div style="overflow: scroll" id="maxInfluenceTable"><header class="fixedTable-header"><table class="table table-bordered"><thead><tr><th class="type-color-bg type-color-text type-color-red">A</th> <th class="type-color-bg type-color-text type-color-blue">B</th> </tr> </thead> </table> </header> <aside class="fixedTable-sidebar"> <table class="table table-bordered"> <tbody> <tr> <th class="type-color-bg type-color-text type-color-red">A</th> </tr> <tr> <th class="type-color-bg type-color-text type-color-blue">B</th> </tr> </tbody> </table> </aside> <div class="fixedTable-body"> <table class="table table-bordered"> <tbody> <tr> <td class="td-empty"></td> <td class="td-input"><input type="number" step=0.01 min=0 max=1 /></td> </tr> <tr> <td class="td-input"><input type="number" step=0.01 min=0 max=1 /></td> <td class="td-empty"></td> </tr> </tbody> </table> </div> </div>';
    //
    // $.dialogbox({
    //     type:'default',
    //     title:'MaxInfluenceTable',
    //     content: data,
    //     width : 1000,
    //     height : 500,
    //     top : '53%',
    //     left : '28%'
    // });

    $('#maxInfluenceTable .fixedTable-header thead tr').empty();
    $('#maxInfluenceTable .fixedTable-sidebar tbody').empty();
    $('#maxInfluenceTable .fixedTable-body tbody').empty();

    nodeSet.sort(function (a,b) {
        return a.node_name.toLowerCase() < b.node_name.toLowerCase() ? -1
            : a.node_name.toLowerCase() > b.node_name.toLowerCase() ? 1 : 0;
    });

    for (var n1 in nodeSet) {
        $('#maxInfluenceTable .fixedTable-header thead tr').append(
            "<th class='type-color-bg type-color-text type-color-blue-grey'>" + nodeSet[n1].node_name + "</th>"
        );

        $('#maxInfluenceTable .fixedTable-sidebar tbody').append(
            "<tr><th class='type-color-bg type-color-text type-color-blue-grey'>" + nodeSet[n1].node_name + "</th></tr>"
        );
    }

    for (var n1 in nodeSet) {
        $('#maxInfluenceTable .fixedTable-body tbody').append("<tr>");
        for(var n2 in nodeSet) {
            $('#maxInfluenceTable .fixedTable-body tbody tr').each(function (index) {
                if (n1 == index) {
                    var value = null;
                    for (var i in maxInfluenceList) {
                        if ((maxInfluenceList[i].origin_id == nodeSet[n1].node_id)
                            && (maxInfluenceList[i].destination_id == nodeSet[n2].node_id)) {
                            value = maxInfluenceList[i].influence_value.toFixed(3);
                            break;
                        }
                    }
                    if(value != null)
                        $(this).append("<td id=\"r"+ n1 + "c" + n2 +"\">" + value + "</td>");
                    else
                        $(this).append("<td id=\"r"+ n1 + "c" + n2 +"\" class=\"td-empty\"></td>");

                }
            });
        }
    }
    // $('#maxInfTableFixedToast').show();
    $('#maxInfluenceTable').show();
    $('#maxInfluenceTable .toast-alert').draggable({
        containment: "#graph",
        scroll: false
    });
}

function openAlertModal(msg, title) {
    if (title == undefined || title == null || !/\S/.test(title)) {
        title = "Alert";
    }
    $('#alertModalTitle').text(title);
    $('#alertModalMsg').text(msg);
    $('#alertModal').modal();
}

function openConfirmModal(msg, title, callback) {
    $('#confirmModalTitle').text(title);
    $('#confirmModalMsg').text(msg);
    $('#btnConfirmModal').unbind('click').off('click').click(callback);
    $('#confirmModal').modal();
}

function openConfirmModal2(msg, title, callback) {
    $('#confirmModalTitle2').text(title);
    $('#confirmModalMsg2').text(msg);
    $('#btnSave').unbind('click').off('click').click(function() {
        menuSaveGraph();
        callback();
    });
    $('#btnDiscard').unbind('click').off('click').click(callback);
    $('#confirmModal2').modal();
}


function initControllers() {
    var welcomeOverlayHeight = $(window).height() - global_consts.graphSvgStartY;
    var welcomeTextMarginTop = welcomeOverlayHeight / 2 - 40;
    $('.welcome-overlay').css('height', welcomeOverlayHeight);
    $('.welcome-overlay > h2').css('margin-top', welcomeTextMarginTop);
    $( window ).resize(function() {
        var welcomeOverlayHeight = $(window).height() - global_consts.graphSvgStartY;
        var welcomeTextMarginTop = welcomeOverlayHeight / 2 - 40;
        $('.welcome-overlay').css('height', welcomeOverlayHeight);
        $('.welcome-overlay > h2').css('margin-top', welcomeTextMarginTop);
    });

    var graphOverlayHeight = $(window).height() - global_consts.graphSvgStartY + 31;
    var graphOverlayTextMarginTop = graphOverlayHeight / 2 - 40;
    $('.graph-close-overlay').css('height', graphOverlayHeight);
    $('.graph-close-overlay > h4').css('margin-top', graphOverlayTextMarginTop);
    $( window ).resize(function() {
        var graphOverlayHeight = $(window).height() - global_consts.graphSvgStartY + 31;
        var graphOverlayTextMarginTop = graphOverlayHeight / 2 - 40;
        $('.graph-close-overlay').css('height', graphOverlayHeight);
        $('.graph-close-overlay > h4').css('margin-top', graphOverlayTextMarginTop);
    });

    $('.main-menu > .dropdown > .dropdown-toggle').attr('disabled', true)
        .addClass('disabled');
    $('#signinForm').on('submit', function (e) {
        e.preventDefault();
        signin();
    });
    $('#editInfoForm').on('submit', function (e) {
       e.preventDefault();
       editInfo();
    });
    $('#menuSignout').click(function() {
        if (networkGraph.isChanged == true) {
            openConfirmModal2("The Graph has been changed.", "Sign-out Confirm", function () {
                $('#newGraphModal').modal('hide');
                networkGraph.isChanged = false;
                toggleAskCloseAndRefresh();
                signout();
            });
        } else
            signout();
    });
    $('#menuEditInfo').click(function () {
        $('#editInfoInputEmail').val(user.email);
        $('#editInfoInputPw').val('');
        $('#editInfoInputPwConfirm').val('');
        $('#editInfoInputName').val(user.user_name);
        $('#editInfoModal').modal('show');
    });
    $('#menuForgot').click(function () {
        $('#findPasswordInputEmail').val('');
        $('#findPasswordModal').modal('show');
    });
    $('#findPasswordForm').on('submit', function (e) {
        e.preventDefault();
        findPassword();
    });
    $('#menuSignup').click(function(e) {
        $('#inputEmail').val('');
        $('#inputPw').val('');
        $('#inputPwConfirm').val('');
        $('#inputName').val('');
        $('#signupModal').modal('show');
    });
    $('#signupForm').on('submit', function(e) {
        e.preventDefault();
        signup();
    });

    $('#btnNewGraph').click(function() {
        var newGraphName = $('#newGraphName').val();
        if (newGraphName!=null && /\S/.test(newGraphName)) {
            if (newGraphName.substring(0,1) == ' ') {
                openAlertModal("Graph name cannot start with a white space.", "Create Error");
            } else {
                if (nowGraphInfo == null) {
                    $('#newGraphModal').modal('hide');
                    newGraph(newGraphName);
                } else {
                    if (networkGraph.isChanged == true) {
                        openConfirmModal2("The Graph has been changed.", "Close Graph Confirm", function () {
                            $('#newGraphModal').modal('hide');
                            newGraph(newGraphName);
                            networkGraph.isChanged = false;
                            toggleAskCloseAndRefresh();
                        });
                    } else {
                        $('#newGraphModal').modal('hide');
                        newGraph(newGraphName);
                    }
                }
            }
        } else openAlertModal("Please input a graph name.", "Create Error");
    });
    $('#btnOpenGraph').click(function() {
        var selectedGraphId = parseInt($('#graphList .list-group-item.active').data('graphid'));
        if (!isNaN(selectedGraphId) && isFinite(selectedGraphId))  {
            if (nowGraphInfo == null) {
                $('#openGraphModal').modal('hide');
                openGraph(selectedGraphId);
            } else {
                if(networkGraph.isChanged == true) {
                    // openConfirmModal("Are you sure to open the selected graph? \nIf you didn't save the current graph, any unsaved changes will be discarded.",
                    //         "Open Graph Confirm", function() {
                    //     $('#openGraphModal').modal('hide');
                    //     openGraph(selectedGraphId);
                    //         networkGraph.isChanged = false;
                    //         toggleAskCloseAndRefresh();
                    // });

                    openConfirmModal2("The Graph has been changed.", "Close Graph Confirm", function () {
                        $('#openGraphModal').modal('hide');
                        openGraph(selectedGraphId);
                        networkGraph.isChanged = false;
                        toggleAskCloseAndRefresh();
                    });
                }
                else {
                    $('#openGraphModal').modal('hide');
                    openGraph(selectedGraphId);
                }
            }
        } else openAlertModal("Please select a graph.", "Open Error");
    });
    $('#btnSaveAsGraph').click(function() {
        var graphName = $('#saveAsGraphName').val();
        if(/\S/.test(graphName)) {
            $('#saveAsGraphModal').modal('hide');
            saveas(graphName);
        } else {
            openAlertModal("Graph name is empty!", "Save As Failure");
        }
    });

    $('#btnDeleteGraph').click(function () {
        deleteGraph();
        $('#deleteGraphModal').modal('hide');
    });
    $('#btnEditGraphName').click(function () {
       var graphName = $('#inputGraphName').val();
       if(nowGraphInfo.graphName == graphName) {
           $('#editGraphNameModal').modal('hide');
       } else {
           $('#editGraphNameModal').modal('hide');
           editGraphName(graphName);
       }
    });

    getSession('main');

    //for test
    /*user = {user_name: 'sm', email: 'sm@gmail.com'}
    $('#menuSignin').hide();
    $('#menuUserWelcome').text("Welcome " + user.user_name + "!");
    $('#menuUser').show();
    $('.content').show();
    $('.welcome-overlay').hide();
    $('.main-menu > .dropdown > .dropdown-toggle')
        .attr('disabled', false).removeClass('disabled');
    setGraphUIEnable(false);

    //for test 2
    setGraphUIEnable(true);
    $('#graphName').text("GRAPH");
    nowGraphInfo = {graphId: 1234, graphName: "GRAPH"};*/
}

function setGraphUIEnable(enable) {
    if (enable) {
        $('.main-menu > .dropdown > .dropdown-toggle:not(.dropdown-default)')
            .attr('disabled', false).removeClass('disabled');
        $('.main-menu > .dropdown > .dropdown-menu-file a:not(.menuDefault)')
            .attr('disabled', false).removeClass('disabled');
        $('.side-menu .menuNewNode, .side-menu .menuNewEdge')
            .attr('disabled', false).removeClass('disabled');
        $('.graph-close-overlay').css('display', 'none');
        $('.graph-area').css('display', 'inline-block');
    } else {
        $('.main-menu > .dropdown > .dropdown-toggle:not(.dropdown-default)')
            .attr('disabled', true).addClass('disabled');
        $('.main-menu > .dropdown > .dropdown-menu-file a:not(.menuDefault)')
            .attr('disabled', true).addClass('disabled');
        $('.side-menu .menuNewNode, .side-menu .menuNewEdge')
            .attr('disabled', true).addClass('disabled');
        $('.graph-area').css('display', 'none');
        $('.graph-close-overlay').css('display', 'inline-block');
    }
}

function signup() {
    var email = $('#inputEmail').val();
    var password = $('#inputPw').val();
    var passwordConfirm = $('#inputPwConfirm').val();
    var name = $('#inputName').val();

    var regExpEmail = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    if (!regExpEmail.test(email)) {
        openAlertModal("Invalid Email", "Signup Failure");
        return;
    } else if (password.length < 4) {
        openAlertModal("The minimum length of password is 4.", "Signup Failure");
        return;
    } else if (password != passwordConfirm) {
        openAlertModal("Password Confirm is different.", "Signup Failure");
    } else if (!/\S/.test(name)) {
        openAlertModal("Name cannot be empty.", "Signup Failure");
    } else {
        $('#signupModal').modal('hide');
        $.LoadingOverlay('show');
        $.ajax("/user", {
            method: 'POST',
            dataType: 'json',
            data: JSON.stringify({
                action: 'signup',
                email: email,
                password: password,
                user_name: name
            }), success: function(res) {
                $.LoadingOverlay('hide');
                if (res['result'] == 'success') {
                    // openAlertModal("Hello, " + name + "! Welcome to Influence Network.", "Signup Success");
                    openAlertModal("An email was sent to you. Check the email to activate your account.", "Alert");
                } else {
                    console.log(res);
                    openAlertModal(res['message'], 'Signup Failure');
                }
            }, error: function(xhr, status, error) {
                $.LoadingOverlay('hide');
                console.log(xhr);
                openAlertModal(xhr.statusText, 'Signup Failure');
            }
        })
    }
}

function editInfo() {
    var password = $('#editInfoInputPw').val();
    var passwordConfirm = $('#editInfoInputPwConfirm').val();
    var name = $('#editInfoInputName').val();
    console.log(password + '/' + passwordConfirm);
    console.log(typeof password);
    if(password == "" && name == "") {
        openAlertModal("Please enter information", "Edit Failure");
    } else if (password != "" && password.length < 4) {
        openAlertModal("The minimum length of password is 4.", "Edit Failure");
        return;
    } else if ((password != "" || passwordConfirm != "") && password != passwordConfirm) {
        openAlertModal("Password Confirm is different.", "Edit Failure");
    } else {
        $('#editInfoModal').modal('hide');
        $.LoadingOverlay('show');
        $.ajax("/user", {
            method: 'POST',
            dataType: 'json',
            data: JSON.stringify({
                action: 'editinfo',
                email: user.email,
                password: password,
                user_name: name
            }), success: function(res) {
                $.LoadingOverlay('hide');
                if (res['result'] == 'success') {
                    openAlertModal("Your Information is edited.", "Alert");
                    if(name != "") {
                        user = res['user'];
                        $('#menuUserWelcome').text("Welcome " + name + "!");
                    }
                } else {
                    console.log(res);
                    openAlertModal(res['message'], 'Edit Failure');
                }
            }, error: function(xhr, status, error) {
                $.LoadingOverlay('hide');
                console.log(xhr);
                openAlertModal(xhr.statusText, 'Edit Failure');
            }
        })
    }
}

function findPassword() {
    var email = $('#findPasswordInputEmail').val();
    var regExpEmail = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    if (!regExpEmail.test(email)) {
        openAlertModal("Alert", "Please enter correct email form like influence@influence.net");
        return;
    } else {
        $('#findPasswordModal').modal('hide');
        $.LoadingOverlay('show');
        $.ajax("/user", {
            method: 'POST',
            dataType: 'json',
            data: JSON.stringify({
                action: 'findpassword',
                email: email
            }), success: function(res) {
                $.LoadingOverlay('hide');
                openAlertModal('If you are registerd, new temporary password is sent to your email.', 'Alert');
            }, error: function(xhr, status, error) {
                $.LoadingOverlay('hide');
                console.log(xhr);
                openAlertModal(xhr.statusText, 'Some problem in server. Please try again later.');
            }
        });
    }
}

function getSession(type) {

    $.LoadingOverlay('show');
    if(type == 'main') {
        $.ajax("/session", {
            method: 'GET',
            dataType: 'json',
            success: function (res) {
                $.LoadingOverlay('hide');
                if (res['result'] == 'success') {
                    console.log("getSession Success");
                    user = res['user'];
                    $('#menuSignin').hide();
                    $('#menuUserWelcome').text("Welcome " + user.user_name + "!");
                    $('#menuUser').show();
                    $('.content').show();
                    $('.welcome-overlay').hide();
                    $('.main-menu > .dropdown > .dropdown-toggle')
                        .attr('disabled', false).removeClass('disabled');
                    setGraphUIEnable(false);
                }
                // else {
                //     if($.cookie('getSession') == null) {
                //         $.cookie("getSession", true);
                //         window.location.reload();
                //     } else {
                //         $.cookie("getSession", null);
                //     }
                // }
            }, error: function(xhr, status, error) {
                $.LoadingOverlay('hide');
            }
        });
    } else {
        $.ajax("/session", {
            method: 'GET',
            dataType: 'json',
            success: function (res) {
                $.LoadingOverlay('hide');
                if (res['result'] == 'fail') {

                    //don't ask one more.
                    window.onbeforeunload = null;
                    window.location.reload(true);
                }
            }, error: function(xhr, status, error) {
                $.LoadingOverlay('hide');
            }
        });
    }
}

function signin() {
    var email = $('#signinEmail').val();
    var password = $('#signinPassword').val();

    $.LoadingOverlay('show');
    $.ajax("/session", {
        method: 'POST',
        dataType: 'json',
        data: JSON.stringify({
            action: 'login',
            email: email,
            password: password
        }), success: function (res) {
            $.LoadingOverlay('hide');
            console.log(res);
            if (res['result'] == 'success') {

                if($('#checkRemember').is(":checked") == true) {
                    $.cookie('check_remember', true);
                    $.cookie('email', email);
                    $.cookie('password', password);
                } else {
                    $.cookie('check_remember', null);
                    $.cookie('email', null);
                    $.cookie('password', null);
                    $("#signinEmail").val("");
                    $("#signinPassword").val("");
                }
                user = res['user'];
                // openAlertModal("Welcome " + user.user_name + "!", 'Login Success');
                // showSnackBar("Login Success!");
                $('#menuSignin').hide();
                $('#menuUserWelcome').text("Welcome " + user.user_name + "!");
                $('#menuUser').show();
                $('.content').show();
                $('.welcome-overlay').hide();
                $('.main-menu > .dropdown > .dropdown-toggle')
                    .attr('disabled', false).removeClass('disabled');
                setGraphUIEnable(false);
            } else {
                openAlertModal(res['message'], 'Alert');
            }
        }, error: function(xhr, status, error) {
            $.LoadingOverlay('hide');
            console.log(xhr);
            openAlertModal(xhr.statusText, 'Login Failure');
        }
    });
}

function signout() {

    var signoutCallback = function(data) {

        $.LoadingOverlay('hide');
        console.log(data);
        user = null;
        nowGraphInfo = null;
        // networkGraph.deleteGraph();
        closeGraph();
        $('#menuSignin').show();
        $('#menuUser').hide();
        $('.welcome-overlay').show();
        $('.content').hide();
        $('.main-menu > .dropdown > .dropdown-toggle').attr('disabled', true)
            .addClass('disabled');

        networkGraph.isChanged = false;
        toggleAskCloseAndRefresh();
    };

    $.LoadingOverlay('show');
    $.ajax("/session", {
        method: 'POST',
        dataType: 'json',
        data: JSON.stringify({
            action: 'logout'
        }),
        success: signoutCallback,
        error: signoutCallback
    });
}

function menuNewGraph() {
    getSession();
    $('#newGraphName').val('');
    $('#newGraphModal').modal();
}
function newGraph(graphName) {
    $.LoadingOverlay('show');
    $.ajax("/graph", {
        method: 'POST',
        dataType: 'json',
        data: JSON.stringify({
            action: 'create',
            email: user.email,
            graph_name: graphName
        }),
        success: function (res) {
            $.LoadingOverlay('hide');
            console.log(res);
            if (res['result'] == 'success') {
                closeGraph();
                setGraphUIEnable(true);
                $('#graphName').text(graphName);
                nowGraphInfo = {graphId: res['graph_id'], graphName: graphName};

                networkGraph.isChanged = false;
                toggleAskCloseAndRefresh();
            } else {
                openAlertModal(res['message'], 'Open Graph Failure');
            }
        }, error: function (xhr, status, error) {
            $.LoadingOverlay('hide');
            openAlertModal(xhr.statusText, 'Open Graph Failure');
        }
    });

}

function menuEditGraphName() {
    $('#inputGraphName').val(nowGraphInfo.graphName);
    $('#editGraphNameModal').modal();
}
function editGraphName(name) {
    $.LoadingOverlay('show');
    $.ajax("/graph", {
        method: 'POST',
        dataType: 'json',
        data: JSON.stringify({
            action: 'edit',
            graph_id: nowGraphInfo.graphId,
            graph_name: name
        }),
        success: function (res) {
            $.LoadingOverlay('hide');
            console.log(res);
            if (res['result'] == 'success') {
                $('#graphName').text(res['graph_name']);
                nowGraphInfo = {graphId: res['graph_id'], graphName: res['graph_name']}
            } else {
                openAlertModal(res['message'], 'Edit Graph Name Failure');
            }
        }, error: function (xhr, status, error) {
            $.LoadingOverlay('hide');
            openAlertModal(xhr.statusText, 'Edit Graph Name Failure');
        }
    });
}

function menuDeleteGraph() {
    $('#deleteGraphModal').modal();
}
function deleteGraph() {
    $.LoadingOverlay('show');
    $.ajax("/graph", {
        method: 'POST',
        dataType: 'json',
        data: JSON.stringify({
            action: 'delete',
            graph_id: nowGraphInfo.graphId
        }),
        success: function (res) {
            $.LoadingOverlay('hide');
            console.log(res);
            if (res['result'] == 'success') {
                closeGraph();
                showSnackBar("Deleted");
            } else {
                openAlertModal(res['message'], 'Delete Graph Failure');
            }
        }, error: function (xhr, status, error) {
            $.LoadingOverlay('hide');
            openAlertModal(xhr.statusText, 'Delete Graph Failure');
        }
    });
    networkGraph.isChanged = false;
    toggleAskCloseAndRefresh();
}

function menuOpenGraph() {
    //test
    // closeGraph();
    // setGraphUIEnable(true);
    // $('#graphName').text('asdf');
    // nowGraphInfo = {graphId: 1, graphName: 'asdf'}
    // return;
    getSession();
    $.LoadingOverlay('show');
    $.ajax("/graph", {
        method: 'GET',
        dataType: 'json',
        data: {
            email: user.email
        },
        success: function (res) {
            $.LoadingOverlay('hide');
            if (res['result'] == 'success') {
                graph_list = res['graph_list'];

                if (graph_list.length != 0) {
                    $('#graphList').empty();
                    for(var i=0; i<graph_list.length; i++) {
                        var graph = graph_list[i];
                        $('#graphList').append("<a class='list-group-item' data-graphid="
                            + graph.graph_id + ">" + graph.graph_name + "</a>" );
                    }
                    $('#graphList .list-group-item').click(function() {
                        $('#graphList .list-group-item').removeClass('active');
                        $(this).addClass('active');
                    }).dblclick(function () {
                        var selectedGraphId = parseInt($('#graphList .list-group-item.active').data('graphid'));
                        if (!isNaN(selectedGraphId) && isFinite(selectedGraphId))  {
                            if (nowGraphInfo == null) {
                                $('#openGraphModal').modal('hide');
                                openGraph(selectedGraphId);
                            } else {
                                if(networkGraph.isChanged == true) {
                                    // openConfirmModal("Are you sure to open the selected graph? \nIf you didn't save the current graph, any unsaved changes will be discarded.",
                                    //     "Open Graph Confirm", function() {
                                    //         $('#openGraphModal').modal('hide');
                                    //         openGraph(selectedGraphId);
                                    //         networkGraph.isChanged = false;
                                    //         toggleAskCloseAndRefresh();
                                    //     });
                                    openConfirmModal2("The Graph has been changed.", "Close Graph Confirm", function () {
                                        $('#openGraphModal').modal('hide');
                                        openGraph(selectedGraphId);
                                        networkGraph.isChanged = false;
                                        toggleAskCloseAndRefresh();
                                    });
                                }
                                else {
                                    $('#openGraphModal').modal('hide');
                                    openGraph(selectedGraphId);
                                }
                            }
                        } else openAlertModal("Please select a graph.", "Open Error");
                    });
                    $('#openGraphModal').modal();
                } else {
                    openAlertModal("There are any graph.", "Open Error");
                }
            } else {
                openAlertModal(res['message'], 'Retrive Graph List Failure');
            }
        }, error: function(xhr, status, error) {
            $.LoadingOverlay('hide');
            openAlertModal(xhr.statusText, 'Retrive Graph List Failure');
        }
    })
}
function openGraph(graphId) {
    $.LoadingOverlay('show');
    $.ajax("/graph", {
        method: 'GET',
        dataType: 'json',
        data: {
            email: user.email,
            graph_id: graphId
        },
        success: function (res) {
            $.LoadingOverlay('hide');
            if (res['result'] == 'success') {
                closeGraph();
                setGraphUIEnable(true);
                $('#graphName').text(res['graph_name']);
                nowGraphInfo = {graphId: graphId, graphName: res['graph_name']};

                loadGraph(res);
            } else {
                openAlertModal(res['message'], 'Open Graph Failure');
            }
        }, error: function (xhr, status, error) {
            $.LoadingOverlay('hide');
            openAlertModal(xhr.statusText, 'Open Graph Failure');
        }
    });
}
function menuCloseGraph() {
    getSession();
    if ($(this).hasClass('disabled') || $(this).attr('disabled')) return;
    if (networkGraph.isChanged == true) {
        // openConfirmModal("Are you sure to close the graph? \nIf you didn't save the current graph, any unsaved changes will be discarded.",
        //     "Close Graph Confirm", closeGraph);
        openConfirmModal2("The Graph has been changed.",
            "Close Graph Confirm", closeGraph);
    } else {
        closeGraph();
    }

}
function closeGraph() {
    setUnselected(true);
    networkGraph.deleteGraph(true);
    networkGraph.resetTransform();
    setGraphUIEnable(false);
    nowGraphInfo = null;
    nodeTypes = {};
    nodeTypeCnt = 0;
    nodeConfidences = {};
    edgeTypes = {};
    edgeTypeCnt = 0;
    viewedEdgeTypes = [networkGraph.EDGE_TYPE_DEFAULT];
    networkGraph.setEdgeViewMode(networkGraph.EDGE_VIEW_MODE_SELECTED, viewedEdgeTypes);
    $('#infPathFixedToast').hide();
    $('#sumInfNodeFixedToast').hide();
    $('#avgInfNodeFixedToast').hide();
    $('#maxInfluenceTable').hide();
    updateNodeTypes();
    updateEdgeTypes();
    updateEdgeList();
    updateManageNodeTypeUI();
    updateManageEdgeTypeUI();
    updateManageConfidenceUI();
    $.dialogbox.close();
}

function menuSaveGraph() {
    getSession();
    if ($(this).hasClass('disabled') || $(this).attr('disabled')) return;
    $.LoadingOverlay('show');
    var graphJson = generateSaveGraphJson();
    console.log(graphJson);
    $.ajax("/graph", {
        async : false,
        method: 'POST',
        contentType: "application/json; charset=UTF-8",
        dataType: 'json',
        data: JSON.stringify({
            action: 'save',
            email: user.email,
            graph: graphJson
        }),
        success: function (res) {
            console.log("save test");
            console.log(res);
            $.LoadingOverlay('hide');
            if (res['result'] == 'success') {
                //save done
                assignSaveIdMaps(res);
                // showSnackBar();
                showSnackBar("Saved");
                networkGraph.isChanged = false;
                toggleAskCloseAndRefresh();
            } else {
                openAlertModal(res['message'], 'Save Graph Failure');
            }
        }, error: function (xhr, status, error) {
            $.LoadingOverlay('hide');
            openAlertModal(xhr.statusText, 'Save Graph Failure');
        }
    });
}
function menuSaveAsGraph() {
    getSession();
    if ($(this).hasClass('disabled') || $(this).attr('disabled')) return;

    $('#saveAsGraphName').val('');
    $('#saveAsGraphModal').modal();
}
function saveas(graphName) {
    $.LoadingOverlay('show');
    var graphJson = generateSaveGraphJson(true);
    console.log(graphJson);
    $.ajax("/graph", {
        method: 'POST',
        dataType: 'json',
        data: JSON.stringify({
            action: 'saveas',
            email: user.email,
            graph_name: graphName,
            graph: graphJson
        }),
        success: function (res) {
            console.log(res);
            $.LoadingOverlay('hide');
            if (res['result'] == 'success') {
                //save done
                nowGraphInfo.graphId = res['graph_id'];
                nowGraphInfo.graphName = graphName;
                assignSaveIdMaps(res);
                showSnackBar("Saved");
            } else {
                openAlertModal(res['message'], 'Save As Graph Failure');
            }
        }, error: function (xhr, status, error) {
            $.LoadingOverlay('hide');
            openAlertModal(xhr.statusText, 'Save As Graph Failure');
        }
    });
}
function assignSaveIdMaps(res) {
    var nodeTypeMap = res['node_type_id_map'];
    for (var nodeTypeId in nodeTypeMap) {
        nodeTypes[nodeTypeId].serverId = nodeTypeMap[nodeTypeId];
    }
    var edgeTypeMap = res['edge_type_id_map'];
    for (var edgeTypeId in edgeTypeMap) {
        edgeTypes[edgeTypeId].serverId = edgeTypeMap[edgeTypeId];
    }
    var nodeMap = res['node_id_map'];
    for (var nodeId in nodeMap) {
        for (var i=0; i<networkGraph.nodes.length; i++) {
            var node = networkGraph.nodes[i];
            if (node.id == nodeId) {
                node.serverId = nodeMap[nodeId];
            }
        }
    }
}

function menuPrintGraph() {
    getSession();
    if ($(this).hasClass('disabled') || $(this).attr('disabled')) return;

    window.print();
    console.log("print");
}

function menuSaveAsImage() {
    getSession();
    // html2canvas(document.body, {
    //     onrendered: function(canvas) {
    //         $('.side-menu').append(canvas);
    //         console.log(canvas);
    //     }
    // });

   setUnselected(true);
    var node = document.getElementById('graph');

    domtoimage.toBlob(node)
        .then(function (blob) {
            window.saveAs(blob, 'graph.png');
        })
        .catch(function (error) {
            console.error('oops, something went wrong!', error);
        });
}

function loadGraph(graphData) {
    nodeTypes = {};
    nodeTypeCnt = 0;
    var nodeTypeServerIds = {};
    for (var i=0; i<graphData['node_type_set'].length; i++) {
        var json = graphData['node_type_set'][i];
        var nodeType = {name: json['node_type_name'],
                        color: json['color'],
                        serverId: json['node_type_id']};
        nodeTypes[nodeTypeCnt] = nodeType;
        nodeTypeServerIds[json['node_type_id']] = nodeTypeCnt;
        nodeTypeCnt++;
    }
    updateManageNodeTypeUI();

    nodeConfidences = {};
    for (var i=0; i<graphData['confidence_set'].length; i++) {
        var json = graphData['confidence_set'][i];
        var sourceCid = nodeTypeServerIds[json['n1_type_id']];
        var targetCid = nodeTypeServerIds[json['n2_type_id']];
        var confidenceValue = json['confidence_value'];
        if (!(sourceCid in nodeConfidences)) {
            nodeConfidences[sourceCid] = {};
        }
        nodeConfidences[sourceCid][targetCid] = confidenceValue;
    }
    updateManageConfidenceUI();

    var nodeServerIds = {};
    for (var i=0; i<graphData['node_set'].length; i++) {
        var json = graphData['node_set'][i];
        var newNodeData = {};
        newNodeData.serverId = json['node_id'];
        if ('domain_id' in json)
            newNodeData.domainId = json['domain_id'];
        else newNodeData.domainId = null;
        newNodeData.title = json['node_name'];
        if ('node_type_id' in json && json['node_type_id'] != null)
            newNodeData.type = nodeTypeServerIds[json['node_type_id']];
        else newNodeData.type = null;
        newNodeData.x = json['x'];
        newNodeData.y = json['y'];
        networkGraph.insertNode(newNodeData);
        nodeServerIds[json['node_id']] = newNodeData;
    }
    updateNodeTypes();

    edgeTypes = {};
    edgeTypeCnt = 0;
    viewedEdgeTypes = [networkGraph.EDGE_TYPE_DEFAULT];
    var edgeTypeServerIds = {};
    for (var i=0; i<graphData['edge_type_set'].length; i++) {
        var json = graphData['edge_type_set'][i];
        var edgeType = {name: json['edge_type_name'],
            color: json['color'],
            serverId: json['edge_type_id']};
        edgeTypes[edgeTypeCnt] = edgeType;
        viewedEdgeTypes.push(edgeTypeCnt);
        edgeTypeServerIds[json['edge_type_id']] = edgeTypeCnt;
        edgeTypeCnt++;
    }
    updateManageEdgeTypeUI();
    updateEdgeTypes();
    networkGraph.setEdgeViewMode(networkGraph.EDGE_VIEW_MODE_SELECTED, viewedEdgeTypes);

    for (var i=0; i<graphData['edge_set'].length; i++) {
        var json = graphData['edge_set'][i];
        var sourceNode = nodeServerIds[json['n1_id']];
        var targetNode = nodeServerIds[json['n2_id']];
        var influence = json['influence_value'];
        var edgeType = null;
        if ('edge_type_id' in json && json['edge_type_id'] != null) {
            edgeType = edgeTypeServerIds[json['edge_type_id']];
        }
        var edge = networkGraph.insertEdge(sourceNode, targetNode, influence, edgeType);
    }
    updateEdgeList();
    networkGraph.setZoom(false);
    networkGraph.updateGraph();
    // networkGraph.d3.event.translate = [384.47928640784977, 190.0129346818016];
    // networkGraph.d3.event.scale = 0.4774208154204951;

    networkGraph.isChanged = false;
    toggleAskCloseAndRefresh();
}

function generateSaveGraphJson(saveAs=false) {
    if (saveAs == undefined || saveAs == null) saveAs=false;
    var graphData = {};
    if (!saveAs) {
        graphData['graph_id'] = nowGraphInfo.graphId;
        graphData['graph_name'] = nowGraphInfo.graphName;
    }

    var nodeTypeServerIds = {};
    graphData['node_type_set'] = [];
    for (var nodeTypeId in nodeTypes) {
        var nodeType = nodeTypes[nodeTypeId];
        var json = {};
        json['node_type_client_id'] = nodeTypeId;
        if (!saveAs && 'serverId' in nodeType) {
            json['node_type_id'] = nodeType.serverId;
            nodeTypeServerIds[nodeType.serverId] = parseInt(nodeTypeId);
        }
        // else json['node_type_id'] = null;
        json['node_type_name'] = nodeType.name;
        json['color'] = nodeType.color;
        graphData['node_type_set'].push(json);
    }

    graphData['confidence_set'] = [];
    for (var sourceId in nodeConfidences) {
        var nodeConfidence = nodeConfidences[sourceId];
        for (var targetId in nodeConfidence) {
            var confidenceValue = nodeConfidence[targetId];
            var json = {};
            if (!saveAs && 'serverId' in nodeTypes[sourceId]) {
                json['n1_type_id'] = nodeTypes[sourceId].serverId;
            } else json['n1_type_client_id'] = parseInt(sourceId);
            if (!saveAs && 'serverId' in nodeTypes[targetId]) {
                json['n2_type_id'] = nodeTypes[targetId].serverId;
            } else json['n2_type_client_id'] = parseInt(targetId);
            json['confidence_value'] = parseFloat(confidenceValue);
            graphData['confidence_set'].push(json);
        }
    }

    var nodeServerIds = {};
    graphData['node_set'] = [];
    for (var i=0; i<networkGraph.nodes.length; i++) {
        var nodeData = networkGraph.nodes[i];
        var json = {};
        if ('domainId' in nodeData)
            json['domain_id'] = nodeData.domainId;
        else json['domain_id'] = null;
        if (!saveAs && 'serverId' in nodeData) {
            json['node_id'] = nodeData.serverId;
            nodeServerIds[nodeData.serverId] = nodeData;
        } //else json['node_id'] = null;
        json['node_client_id'] = nodeData.id;
        json['node_name'] = nodeData.title;
        if (nodeData.type != null) {
            if (!saveAs && 'serverId' in nodeTypes[nodeData.type]) {
                json['node_type_id'] = nodeTypes[nodeData.type].serverId;
            } else json['node_type_client_id'] = parseInt(nodeData.type);
        } else json['node_type_id'] = null;
        json['x'] = nodeData.x;
        json['y'] = nodeData.y;
        graphData['node_set'].push(json);
    }

    var edgeTypeServerIds = {};
    graphData['edge_type_set'] = [];
    for (var edgeTypeId in edgeTypes) {
        var edgeType = edgeTypes[edgeTypeId];
        var json = {};
        json['edge_type_client_id'] = edgeTypeId;
        if (!saveAs && 'serverId' in edgeType) {
            json['edge_type_id'] = edgeType.serverId;
            edgeTypeServerIds[edgeType.serverId] = parseInt(edgeTypeId);
        }
        json['edge_type_name'] = edgeType.name;
        json['color'] = edgeType.color;
        graphData['edge_type_set'].push(json);
    }

    graphData['edge_set'] = [];
    for (var i=0; i<networkGraph.edges.length; i++) {
        var edgeData = networkGraph.edges[i];
        var json = {};
        if (!saveAs && 'serverId' in edgeData.source) {
            json['n1_id'] = edgeData.source.serverId;
        } else json['n1_client_id'] = edgeData.source.id;
        if (!saveAs && 'serverId' in edgeData.target) {
            json['n2_id'] = edgeData.target.serverId;
        } else json['n2_client_id'] = edgeData.target.id;
        if (edgeData.type != null) {
            if (!saveAs && 'serverId' in edgeTypes[edgeData.type]) {
                json['edge_type_id'] = edgeTypes[edgeData.type].serverId;
            } else json['edge_type_client_id'] = parseInt(edgeData.type);
        } else json['edge_type_id'] = null;
        json['influence_value'] = parseFloat(edgeData.name);
        graphData['edge_set'].push(json);
    }

    return graphData;
}

function showSnackBar(text) {
    if(text != 'Updated')
        closeAnalysisToast();
    // Get the snackbar DIV
    var x = document.getElementById("snackbar");
    $("#snackbar").text(text);

    // Add the "show" class to DIV
    x.className = "show";

    // After 1 seconds, remove the show class from DIV
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 1500);
}

// function showSnackBar(text) {
//     SnackBar.show({pos: 'bottom-left'});
// }

function switchSecondMenu (status) {
    if (status == 'show') {
        $('.menu-group').attr('height', '62px !important;');
        $('.sub-menu-container').show();
    } else if(status == 'hide') {
        $('.menu-group').attr('height', '31px !important;');
        $('.sub-menu-container').hide();
    }
}

