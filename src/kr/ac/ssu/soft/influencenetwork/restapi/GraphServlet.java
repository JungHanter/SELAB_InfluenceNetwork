package kr.ac.ssu.soft.influencenetwork.restapi;

import kr.ac.ssu.soft.influencenetwork.*;
import kr.ac.ssu.soft.influencenetwork.db.*;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;

@WebServlet (description = "create/retrieve/update/delete/find", urlPatterns = { "/graph" })
public class GraphServlet extends HttpServlet {

    InfluenceGraph currentGraph = null;
    InfluenceGraphDAO influenceGraphDAO = new InfluenceGraphDAO();
    NodeDAO nodeDAO = new  NodeDAO();
    int defaultEdgeTypeId = -1;

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        /* check session */
//        JSONObject session = SessionServlet.getSession(request);
//        String result = session.get("result");
//        if (result.equals("fail")) {
//            return;
//        }

        PrintWriter out = response.getWriter();
        String id = request.getParameter("graph_id");
        String email = request.getParameter("email");
        JSONObject result = new JSONObject();

        if (id==null && email != null) {    /** getGraphList */
            ArrayList<InfluenceGraph> influenceGraphSet = influenceGraphDAO.getInfluenceGraphList(email);
            if (influenceGraphSet != null) {
                JSONArray influenceGraphJsonArray = new JSONArray();
                for (InfluenceGraph ig : influenceGraphSet) {
                    JSONObject influenceGraphJsonObject = new JSONObject();
                    influenceGraphJsonObject.put("graph_id", ig.getId());
                    influenceGraphJsonObject.put("graph_name", ig.getName());
                    influenceGraphJsonArray.add(influenceGraphJsonObject);
                }
                result.put("graph_list", influenceGraphJsonArray);
                result.put("result", "success");
                System.out.println(result.toJSONString());
                out.write(result.toJSONString());

            }
        } else if(id != null) {             /** getGraph */
            try {
                InfluenceGraph ig = influenceGraphDAO.getInfluenceGraph(Integer.parseInt(id));
                currentGraph = ig;

                JSONObject influenceGraphJsonObject = new JSONObject();
                influenceGraphJsonObject.put("graph_id", ig.getId());
                influenceGraphJsonObject.put("graph_name", ig.getName());

                Set<NodeType> nodeTypeSet = ig.getNodeTypeSet();
                JSONArray nodeTypeJsonArray = new JSONArray();
                for (NodeType nt : nodeTypeSet) {
                    JSONObject nodeTypeJsonObject = new JSONObject();
                    nodeTypeJsonObject.put("node_type_id", nt.getId());
                    nodeTypeJsonObject.put("color", nt.getColor());
                    nodeTypeJsonObject.put("node_type_name", nt.getName());
                    nodeTypeJsonArray.add(nodeTypeJsonObject);
                }
                influenceGraphJsonObject.put("node_type_set", nodeTypeJsonArray);

                Set<Node> nodeSet = ig.getNodeSet();
                JSONArray nodeSetJsonArray = new JSONArray();
                for (Node n : nodeSet) {
                    JSONObject nodeJsonObject = new JSONObject();
                    nodeJsonObject.put("node_id", n.getId());
                    if(n.getNodeType() != null)
                        nodeJsonObject.put("node_type_id", n.getNodeType().getId());
                    else
                        nodeJsonObject.put("node_type_id", null);
                    nodeJsonObject.put("node_name", n.getName());
                    nodeJsonObject.put("domain_id", n.getDomainId());
                    nodeJsonObject.put("x", n.getX());
                    nodeJsonObject.put("y", n.getY());
                    nodeSetJsonArray.add(nodeJsonObject);
                }
                influenceGraphJsonObject.put("node_set", nodeSetJsonArray);

                Set<Confidence> confidenceSet = ig.getConfidenceSet();
                JSONArray confidenceSetJsonArray = new JSONArray();
                for (Confidence c : confidenceSet) {
                    JSONObject confidenceJsonObject = new JSONObject();
                    confidenceJsonObject.put("n1_type_id", c.getOrigin().getId());
                    confidenceJsonObject.put("n2_type_id", c.getDestination().getId());
                    confidenceJsonObject.put("confidence_value", c.getConfidenceValue());
                    confidenceSetJsonArray.add(confidenceJsonObject);
                }
                influenceGraphJsonObject.put("confidence_set", confidenceSetJsonArray);

                Set<EdgeType> edgeTypeSet = ig.getEdgeTypeSet();
                JSONArray edgeTypeSetJsonArray = new JSONArray();
                for (EdgeType et : edgeTypeSet) {
                    if (et == currentGraph.getDefaultEdgeType())
                       continue;

                    JSONObject edgetypeJsonObject = new JSONObject();
                    edgetypeJsonObject.put("edge_type_id", et.getId());
                    edgetypeJsonObject.put("color", et.getColor());
                    edgetypeJsonObject.put("edge_type_name", et.getName());
                    edgeTypeSetJsonArray.add(edgetypeJsonObject);
                }
                influenceGraphJsonObject.put("edge_type_set", edgeTypeSetJsonArray);

                Set<Edge> edgeSet = ig.getEdgeSet();
                JSONArray edgeSetJsonArray = new JSONArray();
                for (Edge e : edgeSet) {
                    JSONObject edgeJsonObject = new JSONObject();
                    edgeJsonObject.put("n1_id", e.getOrigin().getId());
                    edgeJsonObject.put("n2_id", e.getDestination().getId());
                    if (e.getEdgeType() != currentGraph.getDefaultEdgeType())
                        edgeJsonObject.put("edge_type_id", e.getEdgeType().getId());
                    else
                        edgeJsonObject.put("edge_type_id", null);
                    edgeJsonObject.put("influence_value", e.getInfluenceValue());
                    edgeSetJsonArray.add(edgeJsonObject);
                }
                influenceGraphJsonObject.put("edge_set", edgeSetJsonArray);

                influenceGraphJsonObject.put("result", "success");
                System.out.println(influenceGraphJsonObject.toJSONString());
                out.write(influenceGraphJsonObject.toJSONString());
            } catch (Exception e) {
                e.printStackTrace();
                result = new JSONObject();
                result.put("result", "fail");
                result.put("message", e.getMessage());
                out.write(result.toJSONString());
            }
        }
        else {
            result = new JSONObject();
            result.put("result", "fail");
            result.put("message", "input parameter is wrong.");
            out.write(result.toJSONString());
        }
        out.close();
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response){

        /* check session */
//        JSONObject session = SessionServlet.getSession(request);
//        String result = session.get("result");
//        if (result.equals("fail")) {
//            return;
//        }

        BufferedReader br = null;
        PrintWriter out = null;
        String json = "";
        try {
            br = new BufferedReader(new InputStreamReader(request.getInputStream()));
            out = response.getWriter();

            if (br != null) {
                json = br.readLine();
            } else {
                ///error
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        System.out.println(json);

        JSONParser parser = new JSONParser();
        JSONObject jsonObject = null;
        JSONObject result = new JSONObject();

        try {
            jsonObject = (JSONObject) parser.parse(json);
        } catch (ParseException e) {
            e.printStackTrace();
        }

        String action = jsonObject.get("action").toString();
        String userEmail = jsonObject.get("email").toString();

        if(action.equals("create")) {
            String graphName = jsonObject.get("graph_name").toString();
            try {
                InfluenceGraph newInfluenceGraph = new InfluenceGraph(graphName, userEmail);
                currentGraph = newInfluenceGraph;
                if (influenceGraphDAO.saveInfluenceGraph(newInfluenceGraph) == 0) {
                    int temp =newInfluenceGraph.getId();
                    result.put("graph_id", temp);
                    result.put("graph_name", newInfluenceGraph.getName());
                    result.put("result", "success");
                } else {
                    result.put("result", "fail");
                    result.put("message", "Graph name is duplicated");
                }
            } catch (Exception e) {
                e.printStackTrace();
                result = new JSONObject();
                result.put("result", "fail");
                result.put("message", e.getMessage());
            }
        }
        else if(action.equals("delete")) {
            int graphId = Integer.parseInt(jsonObject.get("graph_id").toString());
            try {
                if (influenceGraphDAO.deleteInfluenceGraph(graphId) == 0) {
                    result.put("result", "success");
                } else {
                    result.put("result", "fail");
                    result.put("message", "There is no graph that has same graph id.");
                }
            } catch (Exception e) {
                e.printStackTrace();
                result = new JSONObject();
                result.put("result", "fail");
                result.put("message", e.getMessage());
            }
        }
        else if(action.equals("save")) {
            JSONObject graph = (JSONObject)jsonObject.get("graph");
            int graphId = Integer.parseInt(graph.get("graph_id").toString());
            InfluenceGraph influenceGraph = influenceGraphDAO.getInfluenceGraph(graphId);
            result = save(influenceGraph, graph);
        }
        else if(action.equals("saveas")) {
            userEmail = jsonObject.get("email").toString();
            String graphName = jsonObject.get("graph_name").toString();
            JSONObject graph = (JSONObject) jsonObject.get("graph");

            InfluenceGraph influenceGraph = new InfluenceGraph(graphName, userEmail);
            influenceGraphDAO.saveInfluenceGraph(influenceGraph);
            result = save(influenceGraph, graph);

            if (Integer.parseInt(result.get("graph_id").toString()) <= 0) {
                result = new JSONObject();
                result.put("result", "fail");
                result.put("message", "Save as server error.");
            }
        }
        else {
            result.put("result", "fail");
            result.put("message", "api form is wrong");
        }
        out.write(result.toJSONString());
        out.close();
    }

    public JSONObject save(InfluenceGraph currentGraph, JSONObject graph) {
        JSONObject result = new JSONObject();

        System.out.println(graph.toJSONString());
        try {
            if (currentGraph == null) {
                throw new Exception("No graph");
            }

            /**
             * NodeType
             */
            HashMap<Integer, NodeType> clientIdNodetypeMap = new HashMap<>(); // for new nodetype.
            JSONArray nodetypeJsonArray = (JSONArray) graph.get("node_type_set");
            HashSet<NodeType> nodeTypeRecievedSet = new HashSet<>();

            for (Object o : nodetypeJsonArray) {
                boolean hasId = false;
                int id = 0, clientId = 0;
                String color = null, name = null;
                JSONObject nodetypeJsonObject = (JSONObject) o;

                System.out.println(nodetypeJsonObject.toJSONString());
                if (nodetypeJsonObject.containsKey("node_type_id")) {
                    id = Integer.parseInt(nodetypeJsonObject.get("node_type_id").toString());
                    hasId = true;
                }
                clientId = Integer.parseInt(nodetypeJsonObject.get("node_type_client_id").toString());
                color = nodetypeJsonObject.get("color").toString();
                name = nodetypeJsonObject.get("node_type_name").toString();

                NodeType nodeType = null;
                if (hasId) {

                    /* update node type*/
                    nodeType = currentGraph.getNodeType(id);

                    if (!nodeType.getColor().equals(color) || !nodeType.getName().equals(name)) {
                        nodeType.setColor(color);
                        nodeType.setName(name);

                        currentGraph.updateNodeType(nodeType);
                    }
                } else {

                    /* create new node type */
                    nodeType = new NodeType(color, name);

                    /* save new node type(both memory and DB) */
                    currentGraph.addNodeType(nodeType);  //add exception handling when update node type error.
                    clientIdNodetypeMap.put(clientId, nodeType);
                }
                nodeTypeRecievedSet.add(nodeType);
            }

            /* delete nodetype in momory */
            Set<NodeType> nodeTypeSet = currentGraph.getNodeTypeSet();
            HashSet<NodeType> deletingNodetypeSet = new HashSet<>();
            deletingNodetypeSet.addAll(nodeTypeSet);
            deletingNodetypeSet.removeAll(nodeTypeRecievedSet);

            for (NodeType nt : deletingNodetypeSet) {
                currentGraph.deleteNodeType(nt);
            }

            /* NodeType clientid : nodetypeid JSONobject*/
            JSONObject clientIdNodetypeJsonObject = new JSONObject();
            for (Integer i : clientIdNodetypeMap.keySet()) {
                clientIdNodetypeJsonObject.put(i, clientIdNodetypeMap.get(i).getId());
            }
            System.out.println(clientIdNodetypeJsonObject.toJSONString());
            result.put("node_type_id_map", clientIdNodetypeJsonObject);

            /**
             *  confidence
             */
            JSONArray confidenceJsonArray = (JSONArray) graph.get("confidence_set");
            HashSet<Confidence> confidenceRecievedSet = new HashSet<>();

            for (Object o : confidenceJsonArray) {
                boolean hasN1Id = false, hasN2Id = false;
                int n1typeClientId = 0, n2typeClientId = 0;
                int n1typeId = 0, n2typeId = 0;
                float confidenceValue = 0;
                JSONObject confidenceJsonObject = (JSONObject) o;
                System.out.println(confidenceJsonObject.toJSONString());

                if (confidenceJsonObject.containsKey("n1_type_id")) {
                    n1typeId = Integer.parseInt(confidenceJsonObject.get("n1_type_id").toString());
                    hasN1Id = true;
                } else {
                    n1typeClientId = Integer.parseInt(confidenceJsonObject.get("n1_type_client_id").toString());
                }
                if (confidenceJsonObject.containsKey("n2_type_id")) {
                    n2typeId = Integer.parseInt(confidenceJsonObject.get("n2_type_id").toString());
                    hasN2Id = true;
                } else {
                    n2typeClientId = Integer.parseInt(confidenceJsonObject.get("n2_type_client_id").toString());
                }
                confidenceValue = Float.parseFloat(confidenceJsonObject.get("confidence_value").toString());


                Confidence confidence = null;
                if (hasN1Id && hasN2Id) {
                    confidence = currentGraph.getConfidence(currentGraph.getNodeType(n1typeId), currentGraph.getNodeType(n2typeId));
                    if (confidence.getConfidenceValue() != confidenceValue) {

                        /* update confidence*/
                        confidence.setConfidenceValue(confidenceValue);
                        currentGraph.updateConfidence(confidence);
                    }
                } else {
                    NodeType nt1=null, nt2=null;
                    if(hasN1Id)
                        nt1 = currentGraph.getNodeType(n1typeId);
                    else
                        nt1 = clientIdNodetypeMap.get(n1typeClientId);

                    if(hasN2Id)
                        nt2 = currentGraph.getNodeType(n2typeId);
                    else
                        nt2 = clientIdNodetypeMap.get(n2typeClientId);

                    /* create confidence */
                    confidence = new Confidence(nt1, nt2, confidenceValue);

                    /* save node type(both memory and DB) */
                    currentGraph.addConfidence(confidence); //add exception handling when update node type error.
                }

                confidenceRecievedSet.add(confidence);
            }

            /* delete nodetype in momory */
            Set<Confidence> confidenceSet = currentGraph.getConfidenceSet();
            HashSet<Confidence> deletingConfidenceSet = new HashSet<>();
            deletingConfidenceSet.addAll(confidenceSet);
            deletingConfidenceSet.removeAll(confidenceRecievedSet);

            for (Confidence c : deletingConfidenceSet) {
                currentGraph.deleteConfidence(c);
            }

            /**
             *  Node
             */
            HashMap<Integer, Node> clientIdNodeMap = new HashMap<>();
            JSONArray nodeJsonArray = (JSONArray) graph.get("node_set");
            HashSet<Node> nodeRecievedSet = new HashSet<>();

            for (Object o : nodeJsonArray) {
                boolean hasId = false, hasTypeId = false;
                int id = 0, clientId = 0;
                String domainId = null, name = null;
                int nodetypeId = 0, nodetypeClientId = 0;
                float x = 0, y = 0;

                JSONObject nodeJsonObject = (JSONObject) o;
                System.out.println(nodeJsonObject.toJSONString());

                if (nodeJsonObject.containsKey("node_id")) {
                    id = Integer.parseInt(nodeJsonObject.get("node_id").toString());
                    hasId = true;
                } else {
                    clientId = Integer.parseInt(nodeJsonObject.get("node_client_id").toString());
                }
                if (nodeJsonObject.containsKey("node_type_id")) {
                    if(nodeJsonObject.get("node_type_id") != null)
                        nodetypeId = Integer.parseInt(nodeJsonObject.get("node_type_id").toString());
                    hasTypeId = true;
                } else {
                    nodetypeClientId = Integer.parseInt(nodeJsonObject.get("node_type_client_id").toString());
                }
                if(nodeJsonObject.get("domain_id") != null) {
                    domainId = nodeJsonObject.get("domain_id").toString();
                } else {
                    domainId = null;
                }
                name = nodeJsonObject.get("node_name").toString();
                x = Float.parseFloat(nodeJsonObject.get("x").toString());
                y = Float.parseFloat(nodeJsonObject.get("y").toString());

                Node node = null;
                if (hasId && hasTypeId) {

                    /* Update node */
                    boolean isUpdated = false;
                    node = currentGraph.getNode(id);

                    if(domainId != null) {
                        if (!domainId.equals(node.getDomainId())) {
                            node.setDomainId(domainId);
                            isUpdated = true;
                        }
                    } else {
                        if(node.getDomainId() != null) {
                            node.setDomainId(domainId);
                            isUpdated = true;
                        }
                    }
                    if(node.getNodeType() != null) {
                        if(nodetypeId != node.getNodeType().getId()) {
                            node.setNodeType(currentGraph.getNodeType(nodetypeId));
                            isUpdated = true;
                        }
                    } else {
                        if(nodetypeId != 0) {
                            node.setNodeType(currentGraph.getNodeType(nodetypeId));
                            isUpdated = true;
                        }
                    }
                    if (!name.equals(node.getName())) {
                        node.setName(name);
                        isUpdated = true;
                    }
                    if (x != node.getX()) {
                        node.setX(x);
                        isUpdated = true;
                    }
                    if (y != node.getY()) {
                        node.setY(y);
                        isUpdated = true;
                    }
                    if (isUpdated) {
                        nodeDAO.updateNode(node);
                    }
                } else {    // (hasId && hasTypeId) is false
                    NodeType nodeType = null;
                    if(hasTypeId) { // new node, old node type
                        nodeType = currentGraph.getNodeType(nodetypeId);
                        if(nodeType != null) {
                            node = new Node(domainId, nodeType, name, x, y);
                            nodeDAO.saveNode(node, currentGraph.getId());
                        }
                        else {
                            node = new Node(domainId, null, name, x, y);
                            nodeDAO.saveNode(node, currentGraph.getId());
                        }
                        clientIdNodeMap.put(clientId, node);
                    }
                    else {  //new node type
                        nodeType = clientIdNodetypeMap.get(nodetypeClientId);
                        if (hasId) {    //old node, new node type
                            node = currentGraph.getNode(id);
                            node.setNodeType(nodeType);
                            nodeDAO.updateNode(node);
                        }
                        else {           //new node, new node type
                            node = new Node(domainId, nodeType, name, x, y);
                            nodeDAO.saveNode(node, currentGraph.getId());
                            clientIdNodeMap.put(clientId, node);
                        }
                    }
                }
                nodeRecievedSet.add(node);
            }

            /* delete nodetype in momory */
            Set<Node> nodeSet = currentGraph.getNodeSet();
            HashSet<Node> deletingNodeSet = new HashSet<>();
            deletingNodeSet.addAll(nodeSet);
            deletingNodeSet.removeAll(nodeRecievedSet);

            for (Node n : deletingNodeSet) {
                currentGraph.deleteNode(n);
            }

            /* Node clientid : nodeid JSONobject*/
            JSONObject clientIdNodeJsonObject = new JSONObject();
            for (Integer i : clientIdNodeMap.keySet()) {
                clientIdNodeJsonObject.put(i, clientIdNodeMap.get(i).getId());
            }
            System.out.println(clientIdNodeJsonObject.toJSONString());
            result.put("node_id_map", clientIdNodeJsonObject);

            /**
             * EdgeType
             */
            HashMap<Integer, EdgeType> clientIdEdgetypeMap = new HashMap<>();
            JSONArray edgetypeJsonArray = (JSONArray) graph.get("edge_type_set");
            HashSet<EdgeType> edgeTypeRecievedSet = new HashSet<>();

            for (Object o : edgetypeJsonArray) {
                boolean hasId = false;
                int id = 0, clientId = 0;
                String color = null, name = null;
                JSONObject edgetypeJsonObject = (JSONObject) o;

                System.out.println(edgetypeJsonObject.toJSONString());
                if (edgetypeJsonObject.containsKey("edge_type_id")) {
                    id = Integer.parseInt(edgetypeJsonObject.get("edge_type_id").toString());
                    hasId = true;
                }
                clientId = Integer.parseInt(edgetypeJsonObject.get("edge_type_client_id").toString());
                color = edgetypeJsonObject.get("color").toString();
                name = edgetypeJsonObject.get("edge_type_name").toString();

                EdgeType edgeType = null;
                if (hasId) {
                    edgeType = currentGraph.getEdgeType(id);

                    if (!edgeType.getColor().equals(color) || !edgeType.getName().equals(name)) {

                        /* update edge type*/
                        edgeType.setColor(color);
                        edgeType.setName(name);

                        currentGraph.updateEdgeType(edgeType);
                    }
                } else {

                     /* create node type */
                    edgeType = new EdgeType(color, name);

                    /* save node type(both memory and DB) */
                    currentGraph.addEdgeType(edgeType);  //add exception handling when update node type error.
                    clientIdEdgetypeMap.put(clientId, edgeType);
                }

                edgeTypeRecievedSet.add(edgeType);
            }

            /* delete edgeType in momory */
            Set<EdgeType> edgeTypeSet = currentGraph.getEdgeTypeSet();
            HashSet<EdgeType> deletingEdgetypeSet = new HashSet<>();
            deletingEdgetypeSet.addAll(edgeTypeSet);
            deletingEdgetypeSet.removeAll(edgeTypeRecievedSet);
            deletingEdgetypeSet.remove(currentGraph.getDefaultEdgeType());

            for (EdgeType et : deletingEdgetypeSet) {
                currentGraph.deleteEdgeType(et);
            }

            /* NodeType clientid : edgetypeid JSONobject*/
            JSONObject clientIdEdgetypeJsonObject = new JSONObject();
            for (Integer i : clientIdEdgetypeMap.keySet()) {
                clientIdEdgetypeJsonObject.put(i, clientIdEdgetypeMap.get(i).getId());
            }
            System.out.println(clientIdEdgetypeJsonObject.toJSONString());
            result.put("edge_type_id_map", clientIdEdgetypeJsonObject);

            /**
             * Edge
             */
            JSONArray edgeJsonArray = (JSONArray) graph.get("edge_set");
            HashSet<Edge> edgeRecievedSet = new HashSet<>();

            for (Object o : edgeJsonArray) {
                boolean hasN1Id = false, hasN2Id = false, hasEdgeTypeId = false, isInEdgeSet = false;
                int n1ClientId = 0, n2ClientId = 0, edgeTypeClientId = 0;
                int n1Id = 0, n2Id = 0, edgeTypeId = -1;
                float influenceValue = 0;
                JSONObject edgeJsonObject = (JSONObject) o;
                System.out.println(edgeJsonObject.toJSONString());

                if (edgeJsonObject.containsKey("n1_id")) {
                    n1Id = Integer.parseInt(edgeJsonObject.get("n1_id").toString());
                    hasN1Id = true;
                } else {
                    n1ClientId = Integer.parseInt(edgeJsonObject.get("n1_client_id").toString());
                }
                if (edgeJsonObject.containsKey("n2_id")) {
                    n2Id = Integer.parseInt(edgeJsonObject.get("n2_id").toString());
                    hasN2Id = true;
                } else {
                    n2ClientId = Integer.parseInt(edgeJsonObject.get("n2_client_id").toString());
                }
                if (edgeJsonObject.containsKey("edge_type_id")) {
                    if(edgeJsonObject.get("edge_type_id") != null) {
                        edgeTypeId = Integer.parseInt(edgeJsonObject.get("edge_type_id").toString());
                    } else {
                        edgeTypeId = currentGraph.getDefaultEdgeType().getId();
                    }
                    hasEdgeTypeId = true;
                } else {
                    edgeTypeClientId = Integer.parseInt(edgeJsonObject.get("edge_type_client_id").toString());
                }
                if(hasN1Id && hasN2Id && hasEdgeTypeId) {
                    if(currentGraph.getEdge(currentGraph.getNode(n1Id), currentGraph.getNode(n2Id), currentGraph.getEdgeType(edgeTypeId)) != null)
                        isInEdgeSet = true;
                }

                influenceValue = Float.parseFloat(edgeJsonObject.get("influence_value").toString());

                Edge edge = null;
                if (isInEdgeSet) {

                    /* update Edge*/
                    edge = currentGraph.getEdge(currentGraph.getNode(n1Id), currentGraph.getNode(n2Id), currentGraph.getEdgeType(edgeTypeId));
                    if (edge.getInfluenceValue() != influenceValue) {
                        edge.setInfluenceValue(influenceValue);
                        currentGraph.updateEdge(edge);
                    }
                } else {

                    /* create edge */
                    Node n1=null, n2=null;
                    EdgeType et = null;

                    if(hasN1Id)
                        n1 = currentGraph.getNode(n1Id);
                    else
                        n1 = clientIdNodeMap.get(n1ClientId);
                    if(hasN2Id)
                        n2 = currentGraph.getNode(n2Id);
                    else
                        n2 = clientIdNodeMap.get(n2ClientId);
                    if(hasEdgeTypeId)
                        et = currentGraph.getEdgeType(edgeTypeId);
                    else
                        et = clientIdEdgetypeMap.get(edgeTypeClientId);

                    edge = new Edge(et, n1, n2, influenceValue);

                    /* save edge(both memory and DB) */
                    currentGraph.addEdge(edge); //add exception handling when update node type error.
                }
                edgeRecievedSet.add(edge);
            }

            /* delete nodetype in momory */
            Set<Edge> edgeSet = currentGraph.getEdgeSet();
            HashSet<Edge> deletingEdgeSet = new HashSet<>();
            deletingEdgeSet.addAll(edgeSet);
            deletingEdgeSet.removeAll(edgeRecievedSet);

            for (Edge e : deletingEdgeSet) {
                currentGraph.deleteEdge(e);
            }

            result.put("graph_id", currentGraph.getId());
            result.put("result", "success");
        } catch (Exception e) {
            e.printStackTrace();
            result = new JSONObject();
            result.put("result", "fail");
            result.put("message", e.getMessage());
        }
        return  result;
    }
}


