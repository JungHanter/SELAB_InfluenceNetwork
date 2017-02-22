<%--
  Created by IntelliJ IDEA.
  User: SEL
  Date: 2017-02-22
  Time: 6:21 PM
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Max Influence Table</title>
    <link rel="stylesheet" type="text/css" href="lib/bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="css/bootstrap-custom.css">
    <link rel="stylesheet" type="text/css" href="css/style.css">
</head>
<body>

</body>
</html>
<script src="lib/jquery/jquery-3.1.1.min.js"></script>
<script src="js/jquery.cookie.js"></script>
<script src="js/jquery_extends.js"></script>
<script src="lib/bootstrap/js/bootstrap.min.js"></script>
<script>
    var edgeTypeServerId = 130;
    var graphId = 93;
    $.ajax("/graph", {
        method: 'POST',
        dataType: 'json',
        data: JSON.stringify({
            action: 'allmaxinfluence',
            graph_id: graphId,
            edge_type_id: edgeTypeServerId
        }),
        success: function (res) {
//            $.LoadingOverlay('hide');
//            $('#findMaxInfPathModal').modal('hide');
            console.log(res);

            //find max influence path
//            if (res['result'] == 'success') {
//                if(!res['edge_list'] || res['edge_list'].length == 0) {
//                    openAlertModal("There is NO path from " + sourceNode.title
//                        + " to " + targetNode.title + ".");
//                } else {
//                    var edgeServerList = res['edge_list'];
//                    var maxInfValue = res['max_influence_value'];
//
//                    var nodeServerIdMap = {};
//                    for (var i=0; i<networkGraph.nodes.length; i++) {
//                        var node = networkGraph.nodes[i];
//                        nodeServerIdMap[node.serverId] = node.id;
//                    }
//                    var edgeTypeServerIdMap = {};
//                    for (var k in edgeTypes) {
//                        edgeTypeServerIdMap[edgeTypes[k].serverId] = k;
//                    }
//                    var edgeList = [];
//                    for (var i=0; i<edgeServerList.length; i++) {
//                        var edgeTypeServer = edgeServerList[i];
//                        var sourceId = nodeServerIdMap[edgeTypeServer['n1_id']];
//                        var targetId = nodeServerIdMap[edgeTypeServer['n2_id']];
//                        edgeList.push(networkGraph.getEdge(sourceId, targetId, edgeTypeId));
//                    }
//                    setUnselected(true);
//                    var edgeTypeName = 'Default';
//                    if (edgeType != null) edgeTypeName = edgeType.name;
//                    closeAnalysisToast();
//                    infPathToast(sourceNode.title, targetNode.title, maxInfValue, edgeTypeName, edgeList);
//                    console.log(edgeList);
//                    networkGraph.setEdgeViewMode(networkGraph.EDGE_VIEW_MODE_PATH, edgeList);
//                }
//            } else {
//                openAlertModal(res['message'], 'Find Max Influence Path Failure');
//            }
//            networkGraph.isChanged = false;
        }, error: function (xhr, status, error) {
            console.log(xhr);
//            $.LoadingOverlay('hide');
//            $('#findMaxInfPathModal').modal('hide');
//            openAlertModal(xhr.statusText, 'Find Max Influence Path Failure');
//            networkGraph.isChanged = false;
        }
    });
</script>
