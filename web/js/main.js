var user = null;
var nowGraphInfo = null;

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
    $('#subMenuNodeTypeDropdown').empty();
    for (var tid in nodeTypes) {
        $('#subMenuNodeTypeDropdown').append("<li><a href='#'>"
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
    $('.subMenuEdgeNodeDropdown').empty();
    for (var i=0; i<networkGraph.nodes.length; i++) {
        var nodeData = networkGraph.nodes[i];
        var nodeInfoHtml = "<li><a href='#'>" + nodeDataToSubMenuHtml(nodeData) + "</a></li>";
        $('.subMenuEdgeNodeDropdown').append(nodeInfoHtml);
    }
    $('#subMenuEdgeSourceDropdown > li > a').off('click').unbind('click').click(function() {
        var selItem = $(this);
        $('#subMenuEdgeSource').removeClass('unselected').html(selItem.html());
    });
    $('#subMenuEdgeTargetDropdown > li > a').off('click').unbind('click').click(function() {
        var selItem = $(this);
        $('#subMenuEdgeTarget').removeClass('unselected').html(selItem.html());
    });
    if (selectedEdge != null) {
        if (selectedEdge.edgeData.source == updatedData) {
            $('#subMenuEdgeSourceDropdown > li > a').each(function (idx, elem) {
                if ($(this).find('.nodeName').data('nodeid') == updatedData.id) {
                    $('#subMenuEdgeSource').html($(this).html());
                }
            });
        } else if (selectedEdge.edgeData.target == updatedData) {
            $('#subMenuEdgeTargetDropdown > li > a').each(function (idx, elem) {
                if ($(this).find('.nodeName').data('nodeid') == updatedData.id) {
                    $('#subMenuEdgeTarget').html($(this).html());
                }
            });
        }
    }

    // For new edge dialog
    $('.newEdgeDlgNodeDropdown').empty();
    for (var i=0; i<networkGraph.nodes.length; i++) {
        var nodeData = networkGraph.nodes[i];
        var nodeInfoHtml = "<li><a href='#'>" + nodeDataToSubMenuHtml(nodeData) + "</a></li>";
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
    $('#subMenuEdgeTypeDropdown').empty();
    for (var tid in edgeTypes) {
        $('#subMenuEdgeTypeDropdown').append("<li><a href='#'>"
            + edgeTypeToSubMenuHtml(tid) + "</a></li>");
    }
    $('#subMenuEdgeTypeDropdown > li > a').off('click').unbind('click').click(function() {
        var selItem = $(this);
        $('#subMenuEdgeType').removeClass('unselected').html(selItem.html());
    });

    $('#newEdgeDlgTypeDropdown').empty();
    for (var tid in edgeTypes) {
        $('#newEdgeDlgTypeDropdown').append("<li><a href='#'>"
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
    $('#subMenuEdge').hide();
    $('#subMenuNone').hide();
    $('#subMenuNode').show();

    $('.menuDeleteNode').attr('disabled', false);
    $('.menuDeleteNode').removeClass('disabled');
    $('.menuDeleteEdge').attr('disabled', true);
    $('.menuDeleteEdge').addClass('disabled');

    $('#subMenuNodeName').val(nodeData.title);
    if ('domainId' in nodeData && nodeData.domainId != null)
        $('#subMenuDomainId').val(nodeData.domainId);
    else $('#subMenuDomainId').val('');
    if (nodeData.type != null) {
        $('#subMenuNodeType').removeClass('unselected').html(nodeTypeToSubMenuHtml(nodeData.type));
    } else {
        $('#subMenuNodeType').addClass('unselected').text("Select Type");
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
        $('#subMenuEdgeType').addClass('unselected').text("Select Type");
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

    selectedNode = null;
    selectedEdge = null;
}
function nodeTypeToSubMenuHtml(typeid) {
    return "<span class='nodeTypeColor type-color-bg type-color-"
            + nodeTypes[typeid]['color'] + "'>&nbsp;</span><span class='nodeTypeName'>"
            + nodeTypes[typeid]['name'] +"</span><span class='nodeTypeId'>"
            + typeid + "</span>";
}
function nodeDataToSubMenuHtml(nodeData) {
    var nodeInfoHtml = "<span class='nodeName' data-nodeId=" + nodeData.id
            + ">" + nodeData.title + "</span> (";
    if (nodeData.type == null) {
        nodeInfoHtml += "No Type)";
    } else {
        nodeInfoHtml += "<span class='nodeTypeColor type-color-bg type-color-"
            + nodeTypes[nodeData.type]['color'] + "'>&nbsp;</span><span class='nodeTypeName'>"
            + nodeTypes[nodeData.type]['name'] +"</span><span class='nodeTypeId'>" +
            + nodeData.type + "</span>)";
    }
    return nodeInfoHtml;
}
function edgeTypeToSubMenuHtml(typeid) {
    if (typeid == null) {
        return "<span class='edgeTypeColor type-color-bg type-color-default"
            + "'>&nbsp;</span><span class='edgeTypeName'>"
            + "Default Edge Type</span><span class='edgeTypeId'>"
            + "default</span>";
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
    if (selectedNode != null) {
        var originalType = selectedNode.nodeData.type;
        selectedNode.nodeData.title = $('#subMenuNodeName').val();
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
                selectedNode.nodeData.domainId = domainId;
            }
        }
        else selectedNode.nodeData.domainId = null;

        networkGraph.changeNodeTitle(selectedNode.d3Node, selectedNode.nodeData.title);
        if (originalType != selectedNode.nodeData.type) {
            networkGraph.updateNodeType(selectedNode.d3Node);
        }
        networkGraph.updateGraph();
        updateNodeList('updated', selectedNode.nodeData);
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
        $('#newEdgeDlgInfluence').val('');
        if (selectedNode == null) {
            $('#newEdgeDlgSource').addClass('unselected').html("Select Source Node");
        } else {
            $('#newEdgeDlgSource').removeClass('unselected').html(nodeDataToSubMenuHtml(selectedNode.nodeData));
        }
        $('#newEdgeDlgTarget').addClass('unselected').html("Select Target Node");
        $('#newEdgeDlgType').addClass('unselected').html("Select Type");
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
    if (selectedEdge != null) {
        var originalType = selectedEdge.edgeData.type;
        var originalSourceId = selectedEdge.edgeData.source.id,
            originalTargetId = selectedEdge.edgeData.target.id;
        var changedType = null;
        var changedSourceId = parseInt($('#subMenuEdgeSource .nodeName').data('nodeid')),
            changedTargetId = parseInt($('#subMenuEdgeTarget .nodeName').data('nodeid'));
        if (!$('#subMenuEdgeType').hasClass('unselected'))
            changedType = parseInt($('#subMenuEdgeType .edgeTypeId').text());

        selectedEdge.edgeData.name = $('#subMenuEdgeInfluence').val();

        if (originalSourceId == changedSourceId && originalTargetId == changedTargetId
                && originalType == changedType) {
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
        networkGraph.updateGraph();
        updateEdgeList('updated', selectedEdge.edgeData);
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

$(document).ready(function() {
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
        }, function(event, edgeData) {      // onEdgeChanged
            updateEdgeList(event, edgeData);
        }
    );

    initUI();

    $('#subMenuNodeEditBtn').click(editNode);
    $('#subMenuEdgeEditBtn').click(editEdge);

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
    $('.menuClose').click(menuCloseGraph);
    $('.menuSave').click(menuSaveGraph);
    $('.menuSaveAs').click(menuSaveAsGraph);
    $('.menuPrint').click(menuPrintGraph);
    $('.menuAbout').click(menuAbout);

    $('.menuMaxInfluence').click(menuFindMaxInfluence);
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
    initControllers();
}

function initManageNodeTypeUI() {
    $('#btnEditNodeTypeName').attr('disabled', true);
    $('#btnDeleteNodeType').attr('disabled', true);
    $('#manageNodeTypeColorList').css('visibility', 'hidden');

    $('#manageNodeTypeModal').on('hide.bs.modal', function (e) {
        setUnselected(true);
        updateNodeTypes();
    });
    $('#manageNodeTypeModal').on('hidden.bs.modal', function (e) {
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
        $('#manageNodeTypeList').append("<a href='#' class='list-group-item'>"
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
        $('#manageNodeTypeList').append("<a href='#' class='list-group-item'>"
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
    $('#btnEditEdgeTypeName').attr('disabled', true);
    $('#btnDeleteEdgeType').attr('disabled', true);
    $('#manageEdgeTypeColorList').css('visibility', 'hidden');

    $('#manageEdgeTypeModal').on('hide.bs.modal', function (e) {
        setUnselected(true);
        updateEdgeTypes();
    });
    $('#manageEdgeTypeModal').on('hidden.bs.modal', function (e) {
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
        $('#manageEdgeTypeList').append("<a href='#' class='list-group-item'>"
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
        $('#manageEdgeTypeList').append("<a href='#' class='list-group-item'>"
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
            var confidence = parseFloat($(this).val());
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
        var confidence = parseFloat($(this).val());
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
    $('#manageEdgeTypeViewModal').on('show.bs.modal', function (e) {
        $('#manageEdgeTypeViewList').empty();
        $('#manageEdgeTypeViewList').append("<a href='#' class='list-group-item'>"
            + "<span class='edgeTypeName'>" + "Default (No edge type)" + "</span>"
            + "<span class='typeColor type-color-bg type-color-" + networkGraph.EDGE_TYPE_DEFAULT
            + "' data-color='" + networkGraph.EDGE_TYPE_DEFAULT + "'>&nbsp;</span>"
            + "<span class='typeId'>" + networkGraph.EDGE_TYPE_DEFAULT + "</span></a>");
        for (var typeid in edgeTypes) {
            $('#manageEdgeTypeViewList').append("<a href='#' class='list-group-item'>"
                + "<span class='edgeTypeName'>" + edgeTypes[typeid]['name'] + "</span>"
                + "<span class='typeColor type-color-bg type-color-" + edgeTypes[typeid]['color']
                + "' data-color='" + edgeTypes[typeid]['color'] + "'>&nbsp;</span>"
                + "<span class='typeId'>" + typeid + "</span></a>");
        }
        $('#manageEdgeTypeViewList').find('.list-group-item').each(function(idx, elem) {
            $(this).off('click').unbind('click').click(function() {
                if ($(this).hasClass('active')) {
                    if ($('#manageEdgeTypeViewList .list-group-item.active').length == 1) {
                        openAlertModal("You must select node types at least one.")
                    } else {
                        $(this).attr('class', 'list-group-item');
                    }
                } else {
                    var typeColor = $(this).find('> .typeColor').data('color');
                    $(this).addClass('active').addClass('type-color-bg')
                        .addClass('type-color-text').addClass('type-color-'+typeColor);
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
        $('#checkboxAllEdgeTypeView').prop('checked', false);
    });
    $('#manageEdgeTypeViewModal').on('hide.bs.modal', function (e) {
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
    });
    $('#checkboxAllEdgeTypeView').change(function() {
        if ($(this).is(':checked')) {
            $('#manageEdgeTypeViewList').find('.list-group-item').each(function(idx, elem) {
                $(this).attr('class', 'list-group-item');
                var typeColor = $(this).find('> .typeColor').data('color');
                $(this).addClass('active').addClass('type-color-bg')
                    .addClass('type-color-text').addClass('type-color-' + typeColor);
            });
        }
    })
}

function initFindMaxInfluencePathUI() {
    $('#btnFindMaxInfPathConfirm').click(function() {
        if($('#findMaxInfDlgSource').hasClass('unselected')) {
            openAlertModal("Please select source node.");
        } else if($('#findMaxInfDlgTarget').hasClass('unselected')) {
            openAlertModal("Please select target node.");
        } else if($('#findMaxInfDlgEdgeType').hasClass('unselected')) {
            openAlertModal("Please select edge type.");
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
                                toast('Saved');

                                //find max influence path
                                var sourceId = parseInt($('#findMaxInfDlgSource .nodeName').data('nodeid')),
                                    targetId = parseInt($('#findMaxInfDlgTarget .nodeName').data('nodeid')),
                                    edgeTypeId = $('#findMaxInfDlgEdgeType').find('> .edgeTypeId').text();
                                var sourceNode = networkGraph.getNodeById(sourceId),
                                    targetNode = networkGraph.getNodeById(targetId);
                                var edgeType = null;
                                if (edgeTypeId != 'default') {
                                    edgeTypeId = parseInt(edgeTypeId);
                                    edgeType = edgeTypes[edgeTypeId];
                                } else edgeTypeId = null;
                                var edgeTypeServerId = null;
                                if (edgeType != null) edgeTypeServerId = edgeType.serverId;

                                $.ajax("/graph", {
                                    method: 'POST',
                                    dataType: 'json',
                                    data: JSON.stringify({
                                        action: 'maxinfluence',
                                        graph_id: nowGraphInfo.graphId,
                                        n1_id: sourceNode.serverId,
                                        n2_id: targetNode.serverId,
                                        edge_type_id: edgeTypeServerId
                                    }),
                                    success: function (res) {
                                        $.LoadingOverlay('hide');
                                        $('#findMaxInfPathModal').modal('hide');
                                        console.log(res);

                                        //find max influence path
                                        if (res['result'] == 'success') {
                                            if(!res['edge_list'] || res['edge_list'].length == 0) {
                                                openAlertModal("There is NO path from " + sourceNode.title
                                                    + " to " + targetNode.title + ".");
                                            } else {
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
                                                    var sourceId = nodeServerIdMap[edgeTypeServer['n1_id']];
                                                    var targetId = nodeServerIdMap[edgeTypeServer['n2_id']];
                                                    edgeList.push(networkGraph.getEdge(sourceId, targetId, edgeTypeId));
                                                }
                                                setUnselected(true);
                                                var edgeTypeName = 'Default';
                                                if (edgeType != null) edgeTypeName = edgeType.name;
                                                infPathToast(sourceNode.title, targetNode.title, maxInfValue, edgeTypeName, edgeList);
                                                console.log(edgeList);
                                                networkGraph.setEdgeViewMode(networkGraph.EDGE_VIEW_MODE_PATH, edgeList);
                                            }
                                        } else {
                                            openAlertModal(res['message'], 'Find Max Influence Path Failure');
                                        }
                                        networkGraph.isChanged = false;
                                    }, error: function (xhr, status, error) {
                                        console.log(xhr);
                                        $.LoadingOverlay('hide');
                                        $('#findMaxInfPathModal').modal('hide');
                                        openAlertModal(xhr.statusText, 'Find Max Influence Path Failure');
                                        networkGraph.isChanged = false;
                                    }
                                });
                            } else {
                                $.LoadingOverlay('hide');
                                $('#findMaxInfPathModal').modal('hide');
                                openAlertModal(res['message'], 'Save Graph Failure');
                                networkGraph.isChanged = false;
                            }
                        }, error: function (xhr, status, error) {
                            console.log(xhr);
                            $.LoadingOverlay('hide');
                            $('#findMaxInfPathModal').modal('hide');
                            openAlertModal(xhr.statusText, 'Save Graph Failure');
                            networkGraph.isChanged = false;
                        }
                    });
                });
            networkGraph.isChanged = false;
        } else {
            //find max influence path
            var sourceId = parseInt($('#findMaxInfDlgSource .nodeName').data('nodeid')),
                targetId = parseInt($('#findMaxInfDlgTarget .nodeName').data('nodeid')),
                edgeTypeId = $('#findMaxInfDlgEdgeType').find('> .edgeTypeId').text();
            var sourceNode = networkGraph.getNodeById(sourceId),
                targetNode = networkGraph.getNodeById(targetId);
            var edgeType = null;
            if (edgeTypeId != 'default') {
                edgeTypeId = parseInt(edgeTypeId);
                edgeType = edgeTypes[edgeTypeId];
            } else edgeTypeId = null;
            var edgeTypeServerId = null;
            if (edgeType != null) edgeTypeServerId = edgeType.serverId;

            $.ajax("/graph", {
                method: 'POST',
                dataType: 'json',
                data: JSON.stringify({
                    action: 'maxinfluence',
                    graph_id: nowGraphInfo.graphId,
                    n1_id: sourceNode.serverId,
                    n2_id: targetNode.serverId,
                    edge_type_id: edgeTypeServerId
                }),
                success: function (res) {
                    $.LoadingOverlay('hide');
                    $('#findMaxInfPathModal').modal('hide');
                    console.log(res);

                    //find max influence path
                    if (res['result'] == 'success') {
                        if(!res['edge_list'] || res['edge_list'].length == 0) {
                            openAlertModal("There is NO path from " + sourceNode.title
                                + " to " + targetNode.title + ".");
                        } else {
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
                                var sourceId = nodeServerIdMap[edgeTypeServer['n1_id']];
                                var targetId = nodeServerIdMap[edgeTypeServer['n2_id']];
                                edgeList.push(networkGraph.getEdge(sourceId, targetId, edgeTypeId));
                            }
                            setUnselected(true);
                            var edgeTypeName = 'Default';
                            if (edgeType != null) edgeTypeName = edgeType.name;
                            infPathToast(sourceNode.title, targetNode.title, maxInfValue, edgeTypeName, edgeList);
                            console.log(edgeList);
                            networkGraph.setEdgeViewMode(networkGraph.EDGE_VIEW_MODE_PATH, edgeList);
                        }
                    } else {
                        openAlertModal(res['message'], 'Find Max Influence Path Failure');
                    }
                    networkGraph.isChanged = false;
                }, error: function (xhr, status, error) {
                    console.log(xhr);
                    $.LoadingOverlay('hide');
                    $('#findMaxInfPathModal').modal('hide');
                    openAlertModal(xhr.statusText, 'Find Max Influence Path Failure');
                    networkGraph.isChanged = false;
                }
            });
            networkGraph.isChanged = false;
        }
    });
    $('#findMaxInfPathModal').on('show.bs.modal', function (e) {
        $('#findMaxInfDlgSource').addClass('unselected').html("Select Source Node");
        $('#findMaxInfDlgTarget').addClass('unselected').html("Select Target Node");
        $('.findMaxInfDlgNodeDropdown').empty();
        for (var i=0; i<networkGraph.nodes.length; i++) {
            var nodeData = networkGraph.nodes[i];
            var nodeInfoHtml = "<li><a href='#'>" + nodeDataToSubMenuHtml(nodeData) + "</a></li>";
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

        $('#findMaxInfDlgEdgeType').addClass('unselected').html("Select Type");
        $('#findMaxInfDlgEdgeTypeDropdown').empty();
        $('#findMaxInfDlgEdgeTypeDropdown').append("<li><a href='#'>"
            + edgeTypeToSubMenuHtml(null) + "</a></li>");
        for (var tid in edgeTypes) {
            $('#findMaxInfDlgEdgeTypeDropdown').append("<li><a href='#'>"
                + edgeTypeToSubMenuHtml(tid) + "</a></li>");
        }
        $('#findMaxInfDlgEdgeTypeDropdown > li > a').off('click').unbind('click').click(function() {
            var selItem = $(this);
            $('#findMaxInfDlgEdgeType').removeClass('unselected').html(selItem.html());
        });
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

function menuFindMaxInfluence() {
    if (networkGraph.nodes.length < 2) {
        openAlertModal("Finding max influence path can be performed when there are more than two nodes.");
    } else {
        $('#findMaxInfPathModal').modal('show');
    }
}

function infPathToast(node1Name, node2Name, infValue, edgeTypeName, edgeList) {
    var infoHtml = "Max Influence Path from &lt;" + node1Name
        + "&gt; to &lt;" + node2Name + "&gt; <br/>"
        + "Max Influence Value: " + infValue
        + "<br/>Edge Type: " + edgeTypeName
        + "<br/>" + "Route" + ": ";

    for (var i = 0; i < edgeList.length; i++) {
        if (i==0) {
            infoHtml += edgeList[i].source.title;
            infoHtml += " -> ";
            infoHtml += edgeList[i].target.title;
        } else {
            infoHtml += " -> ";
            infoHtml += edgeList[i].target.title;
        }
    }

    $('#infPathFixedInfo').html(infoHtml);
    $('#infPathFixedToast').show();
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
    $('#menuSignout').click(function() {
        signout();
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
                    openConfirmModal("Are you sure to create new graph? \nIf you didn't save the current graph, any unsaved changes will be discarded.",
                            "Create Graph Confirm", function() {
                        $('#newGraphModal').modal('hide');
                        newGraph(newGraphName);
                    });
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
                openConfirmModal("Are you sure to open the selected graph? \nIf you didn't save the current graph, any unsaved changes will be discarded.",
                        "Open Graph Confirm", function() {
                    $('#openGraphModal').modal('hide');
                    openGraph(selectedGraphId);
                });
            }
        } else openAlertModal("Please select a graph.", "Open Error");
    });
    $('#btnSaveAsGraph').click(function() {
        var graphName = $('#saveAsGraphName').val();
        if(/\S/.test(graphName)) {
            $('#saveAsGraphModal').modal('hide');
            saveAs(graphName);
        } else {
            openAlertModal("Graph name is empty!", "Save As Failure");
        }
    });

    getSession();

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
                    openAlertModal("Hello, " + name + "! Welcome to Influence Network.", "Signup Success")
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

function getSession() {
    $.LoadingOverlay('show');
    $.ajax("/session", {
        method: 'GET',
        dataType: 'json',
        success: function (res) {
            $.LoadingOverlay('hide');
            if (res['result'] == 'success') {
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
        }, error: function(xhr, status, error) {
            $.LoadingOverlay('hide');
        }
    });
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
                user = res['user'];
                openAlertModal("Welcome " + user.user_name + "!", 'Login Success');
                $('#menuSignin').hide();
                $('#menuUserWelcome').text("Welcome " + user.user_name + "!");
                $('#menuUser').show();
                $('.content').show();
                $('.welcome-overlay').hide();
                $('.main-menu > .dropdown > .dropdown-toggle')
                    .attr('disabled', false).removeClass('disabled');
                setGraphUIEnable(false);
            } else {
                openAlertModal(res['message'], 'Login Failure');
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
                nowGraphInfo = {graphId: res['graph_id'], graphName: graphName}
            } else {
                openAlertModal(res['message'], 'Open Graph Failure');
            }
        }, error: function (xhr, status, error) {
            $.LoadingOverlay('hide');
            openAlertModal(xhr.statusText, 'Open Graph Failure');
        }
    });
    networkGraph.isChanged = false;
}

function menuOpenGraph() {
    //test
    // closeGraph();
    // setGraphUIEnable(true);
    // $('#graphName').text('asdf');
    // nowGraphInfo = {graphId: 1, graphName: 'asdf'}
    // return;

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

                $('#graphList').empty();
                for(var i=0; i<graph_list.length; i++) {
                    var graph = graph_list[i];
                    $('#graphList').append("<a href='#' class='list-group-item' data-graphid="
                        + graph.graph_id + ">" + graph.graph_name + "</a>" );
                }
                $('#graphList .list-group-item').click(function() {
                    $('#graphList .list-group-item').removeClass('active');
                    $(this).addClass('active');
                });
                $('#openGraphModal').modal();
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
            console.log(res);
            $.LoadingOverlay('hide');
            if (res['result'] == 'success') {
                closeGraph();
                setGraphUIEnable(true);
                $('#graphName').text(res['graph_name']);
                nowGraphInfo = {graphId: graphId, graphName: res['graph_name']}

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
    if ($(this).hasClass('disabled') || $(this).attr('disabled')) return;
    openConfirmModal("Are you sure to close the graph? \nIf you didn't save the current graph, any unsaved changes will be discarded.",
            "Close Graph Confirm", closeGraph);
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
    updateNodeTypes();
    updateEdgeTypes();
    updateEdgeList();
    updateManageNodeTypeUI();
    updateManageEdgeTypeUI();
    updateManageConfidenceUI();
}

function menuSaveGraph() {
    if ($(this).hasClass('disabled') || $(this).attr('disabled')) return;
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
            $.LoadingOverlay('hide');
            if (res['result'] == 'success') {
                //save done
                assignSaveIdMaps(res);
                toast('Saved');
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
    if ($(this).hasClass('disabled') || $(this).attr('disabled')) return;

    $('#saveAsGraphName').val('');
    $('#saveAsGraphModal').modal();
}
function saveAs(graphName) {
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
                toast('Saved');
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
    if ($(this).hasClass('disabled') || $(this).attr('disabled')) return;
}
function menuAbout() {
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
        var edge = networkGraph.createEdge(sourceNode, targetNode, influence, edgeType);
    }
    updateEdgeList();
    networkGraph.updateGraph();
    networkGraph.isChanged = false;
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