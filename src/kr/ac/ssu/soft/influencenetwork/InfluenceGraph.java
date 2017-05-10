package kr.ac.ssu.soft.influencenetwork;
import kr.ac.ssu.soft.influencenetwork.db.*;

import java.util.ArrayList;
import java.util.Set;
import java.util.*;
import java.util.regex.Pattern;

public class InfluenceGraph {
    private int id;
    private String name;
    private String userEmail;
    private EdgeType defaultEdgeType;

    private Set<NodeType> nodeTypeSet = new TreeSet<NodeType>();
    private Set<Node> nodeSet = new TreeSet<Node>();
    private Set<EdgeType> edgeTypeSet = new TreeSet<>();
    private Set<Edge> edgeSet = new TreeSet<Edge>();
    private Set<Confidence> confidenceSet = new TreeSet<Confidence>();

    private NodeTypeDAO nodeTypeDAO = new NodeTypeDAO();
    private NodeDAO nodeDAO = new NodeDAO();
    private EdgeTypeDAO edgeTypeDAO = new EdgeTypeDAO();
    private EdgeDAO edgeDAO = new EdgeDAO();
    private ConfidenceDAO confidenceDAO = new ConfidenceDAO();

    public InfluenceGraph(String name) {
        this.name = name;
    }

    public InfluenceGraph(String name, String userEmail) {
        this.name = name;
        this.userEmail = userEmail;
    }

    public InfluenceGraph(int id, String name, String userEmail) {
        this.id = id;
        this.name = name;
        this.userEmail = userEmail;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    /**
     * NodeType Methods
     */

    /**
     * Return success or failure of adding nodetype to nodeSet and DB.
     *
     * @param nt            NodeType for adding to nodeSet and DB.
     * @return isSuccess    success or failure of adding.
     */
    public boolean addNodeType(NodeType nt) {
        if (nodeTypeSet.add(nt)) {
            if (nodeTypeDAO.saveNodeType(nt, id) == 0) {
                return true;
            } else
                nodeTypeSet.remove(nt); // as DB Failure is, remove nodetype
        }
        return false;
    }

    public Set<NodeType> getNodeTypeSet() {
        return nodeTypeSet;
    }

    /**
     * Return a nodetype in nodeTypeSet which has same nodeTypeId.
     *
     * @param ntId    ID of node type to find.
     * @return NodeType     Node type which has same nodeTypeId.
     */
    public NodeType getNodeType(int ntId) {
        for (NodeType nt : nodeTypeSet) {
            if (nt.getId() == ntId) return nt;
        }
        return null;
    }

    public boolean updateNodeType(NodeType nt) {
        if (nodeTypeSet.contains(nt)) {
            return nodeTypeDAO.updateNodeType(nt);
        }
        else return false;
    }

    public boolean deleteNodeType(NodeType nt) {
        if (nodeTypeSet.contains(nt)) {
        /* set nodetype of node to null*/
        Set<Node> updatedNodeSet = new TreeSet<>();
        for (Node n : nodeSet) {
            NodeType nNodeType = n.getNodeType();
            if(nNodeType != null) {
                if (nNodeType == nt){
                    n.setNodeType(null);
                }
            }
        }

        Set<Confidence> deletedConfidenceSet = new TreeSet<Confidence>();
        for (Confidence c : confidenceSet) {
            if((c.getOrigin() == nt) || (c.getDestination() == nt)) {
                deletedConfidenceSet.add(c);
            }
        }
        confidenceSet.removeAll(deletedConfidenceSet);
        nodeTypeSet.remove(nt);
        return nodeTypeDAO.deleteNodeType(nt.getId());
        } else return false;
    }

    /**
     * Confidence Methods
     */

    /**
     * Return success or failure of adding confidence to confidenceSet and DB.
     *
     * @param confidence    confidence for adding confidenceSet and DB.
     * @return isSuccess    Success or failure of adding.
     */
    public boolean addConfidence(Confidence confidence) {
        if (confidenceSet.add(confidence)) {
            if (confidenceDAO.saveConfidence(confidence, id) == 0) {
                return true;
            }
            confidenceSet.remove(confidence);
        }
        return false;
    }

    public Set<Confidence> getConfidenceSet() {
        return confidenceSet;
    }

    public Confidence getConfidence(NodeType nt1, NodeType nt2) {
        for (Confidence c : confidenceSet) {
            if (c.getOrigin() == nt1 && c.getDestination() == nt2)
                return c;
        }
        return null;
    }

    public boolean updateConfidence(Confidence c) {
        if (confidenceSet.contains(c)) {
            return confidenceDAO.updateConfidence(c.getOrigin(), c.getDestination(), c.getConfidenceValue());
        } else return false;
    }

    public boolean deleteConfidence(Confidence c) {
        if (confidenceSet.contains(c)) {
            confidenceSet.remove(c);
            return confidenceDAO.deleteConfidence(c.getOrigin(), c.getDestination());
        } else return false;
    }

    //TODO Need to fix
    public float getConfidenceValue(NodeType nt1, NodeType nt2) {

        for(Confidence c : confidenceSet){
            if(nt1 == c.getOrigin() && nt2 == c.getDestination())
                return c.getConfidenceValue();
        }

        return 1;
    }

    /**
     * Node Methods
     */

    /**
     * Return success or failure of adding node to nodeSet and DB.
     *
     * @param node          Node for adding to nodeSet and DB.
     * @return isSuccess    success of failure of adding
     */
	public boolean addNode(Node node) {
        if (nodeSet.add(node)) {
            if (nodeDAO.saveNode(node, id) == 0) {
                return true;
            }
            nodeSet.remove(node);
        }
        return false;
    }

    public Set<Node> getNodeSet() {
        return nodeSet;
    }

    /**
     * Return node in nodeSet which has same nodeid.
     *
     * @param nodeId    ID of node to find.
     * @return node     Node which has same nodeid.
     */
    public Node getNode(int nodeId) {
        for (Node n : nodeSet) {
            if (n.getId() == nodeId) return n;
        }
        return null;
    }

    public boolean updateNode(Node node) {
        if(nodeSet.contains(node)) {
            return nodeDAO.updateNode(node);
        } else return false;
    }

    /**
     * Return success or failure of delete node in nodeSet and DB.
     *
     * @param node       Node ID to delete node
     * @return isSuccess    success or failure for deleting
     */
    public boolean deleteNode(Node node) {
        if(nodeSet.contains(node)) {
            nodeSet.remove(node);
            Set<Edge> deletedEdgeSet = new TreeSet<Edge>();
            for (Edge e : edgeSet) {
                if ((e.getOrigin() == node) || (e.getDestination() == node)) {
                    deletedEdgeSet.add(e);
                }
            }

            /* Delete edges connected with deleted node */
            edgeSet.removeAll(deletedEdgeSet);
            return nodeDAO.deleteNode(node.getId());
        } else return false;
    }

    /**
     * Edge Type Methods
     */

    public boolean addEdgeType(EdgeType et) {
        if (edgeTypeSet.add(et)) {
            if (edgeTypeDAO.saveEdgeType(et, id) == 0) {
                return true;
            } else
                edgeTypeSet.remove(et); // as DB Failure is, remove nodetype
        }
        return false;
    }

    public Set<EdgeType> getEdgeTypeSet() {
        return edgeTypeSet;
    }

    public EdgeType getEdgeType(int etId) {
        for (EdgeType et : edgeTypeSet) {
            if (et.getId() == etId) return et;
        }
        return null;
    }

    public EdgeType getDefaultEdgeType() {
        return defaultEdgeType;
    }

    public void setDefaultEdgeType(EdgeType defaultEdgeType) {
        this.defaultEdgeType = defaultEdgeType;
    }

    public boolean updateEdgeType(EdgeType et) {
        if(edgeTypeSet.contains(et)) {
            return edgeTypeDAO.updateEdgeType(et);
        } else return false;
    }

    public boolean deleteEdgeType(EdgeType et) {
        if(edgeTypeSet.contains(et)) {

            /* set edgetype of edge to null*/
            Set<Edge> updatedEdgeSet = new TreeSet<>();
            for (Edge e : edgeSet) {
                EdgeType edgeType = e.getEdgeType();
                if (edgeType != null) {
                    if (edgeType == et) {
                        e.setEdgeType(null);
                    }
                }
            }
            edgeTypeSet.remove(et);
            return edgeTypeDAO.deleteEdgeType(et.getId());
        } else return false;
    }

    /**
     * Edge Methods
     */

    /**
     * Return success or failure of adding edge to edgeSet and DB.
     *
     * @param edge          edge for adding to edgeSet and DB.
     * @return isSuccess    success or failure of adding.
     */
    public boolean addEdge(Edge edge) {
        if (edgeSet.add(edge)) {
            if (edgeDAO.saveEdge(edge, id) == 0) {
                return true;
            }
            edgeSet.remove(edge);
        }
        return false;
    }

    public Set<Edge> getEdgeSet() {
        return edgeSet;
    }

    public Edge getEdge(Node n1, Node n2, EdgeType edgeType) {
        for (Edge e : edgeSet) {
            if (e.getOrigin() == n1 && e.getDestination() == n2 && e.getEdgeType() == edgeType)
                return e;
        }
        return null;
    }

    public boolean updateEdge(Edge edge) {
       if (edgeSet.contains(edge)) {
           return edgeDAO.updateEdge(edge.getOrigin(), edge.getDestination(), edge.getEdgeType(), edge.getInfluenceValue());
       } else return false;
    }

    public boolean deleteEdge(Edge edge) {
        if(edgeSet.contains(edge)) {
            edgeSet.remove(edge);
            return edgeDAO.deleteEdge(edge.getOrigin(), edge.getDestination(), edge.getEdgeType());
        } else return false;
    }

    /**
     * Path Methods
     */

    /**
     * Return pathList from source to target node. This method call findPathSet method.
     *
     * @param source       Source node of pathList.
     * @param target       Target node of pathList.
     * @return pathList    All paths from source to target.
     */
    public ArrayList<Path> pathSet(Node source, Node target, Set<EdgeType> edgeTypeSet) {
        ArrayList<Path> pathArrayList = new ArrayList<Path>();

//        newFindPathSet(source, target, new ArrayList<Edge>(), pathArrayList, edgeTypeSet);

        if (pathArrayList.size() != 0) {
            return pathArrayList;
        }
        return null;
    }

    /**
     * Return all path from source node to target node.
     *
     * @param next         Current node in finding path.
     * @param target       Target node.
     * @param edgelist     Current edgelist in finding path.
     * @param pathlist     Container to save path from source node to target node.
     */
    public void findPathSet(Node next, Node target, ArrayList<Edge> edgelist, ArrayList<Path> pathlist, EdgeType et) {

        /* Exit Condition of Recursive Function */
		if(next == target) {
            Path path = new Path(edgelist);
            pathlist.add(path);
            return;
        } else {

            /* To find edge connected with node*/
		    for (Edge e : edgeSet) {
		        if(e.getOrigin() == next && e.getEdgeType() == et) {
                    boolean cycle = false;

                    /* To check cycle in edgelist */
                    for (Edge e2 : edgelist) {
//                        if (e.getDestination() == e2.getOrigin() && e2.getEdgeType() == et) {
                        if (e.getDestination() == e2.getOrigin()) {
                            cycle = true;
                            break;
                        }
                    }
                    if (cycle==false) {
                        ArrayList<Edge> new_edgelist = new ArrayList<Edge>();
                        new_edgelist.addAll(edgelist);
                        new_edgelist.add(e);
                        findPathSet(e.getDestination(), target, new_edgelist, pathlist, et);
                    }
                }
            }
        }
    }

    public void findMaxInfluencePath(Node next, Node target, ArrayList<Edge> edgelist, Set<EdgeType> edgeTypeSet, boolean isConfidence, float value, Path maxInfluencePath) {

        /* Check Promising */
        if(maxInfluencePath.getInfluenceValue() > value) {
            return;
        }

        /* Exit Condition of Recursive Function */
        if(next == target) {
            if (maxInfluencePath.getInfluenceValue() < value) {
                maxInfluencePath.setEdgeArrayList(edgelist);
                maxInfluencePath.setInfluenceValue(value);
            }
            return;
        } else {

            /* To find edge connected with node*/
            for (Edge e : edgeSet) {
                if(e.getOrigin() == next) {
                    for(EdgeType et : edgeTypeSet) { // to find the edge having same edge type.
                        if(e.getEdgeType() == et) {
                            boolean cycle = false;

                             /* To check cycle in edgelist */
                            for (Edge e2 : edgelist) {
                                if (e.getDestination() == e2.getOrigin()) {
                                    cycle = true;
                                    break;
                                }
                            }
                            if (cycle==false) {
                                ArrayList<Edge> new_edgelist = new ArrayList<Edge>();
                                new_edgelist.addAll(edgelist);
                                new_edgelist.add(e);
                                if (isConfidence) {
                                    float confidenceValue = getConfidenceValue(e.getOrigin().getNodeType(), e.getDestination().getNodeType());
                                    value *= confidenceValue * e.getInfluenceValue();
                                } else {
                                    value *= e.getInfluenceValue();
                                }
                                findMaxInfluencePath(e.getDestination(), target, new_edgelist, edgeTypeSet, isConfidence, value, maxInfluencePath);
                            }
                        }
                    }
                }
            }
        }
    }

    public void printPath(Path path) { // print route of path.
        ArrayList<Edge> edgeArrayList = new ArrayList<Edge>();
        edgeArrayList = path.getEdgeArrayList();
        if (edgeArrayList.size() != 0) {
            String edgeString = "";
            edgeString += edgeArrayList.get(0).getOrigin().getName();
            for (int i = 0; i < edgeArrayList.size(); i++) {
                edgeString += '-';
                edgeString += edgeArrayList.get(i).getDestination().getName();
            }
            System.out.println(edgeString);
        }
        else
            System.out.println("This Path has no edges.");
    }

    public float influence(Path path, boolean isConfidence) { //return influence value of path
        ArrayList<Edge> edgeArrayList = path.getEdgeArrayList();
        if (edgeArrayList != null) {
            float influence = 1;
            float confidence = 1;
            for (int i = 0; i < edgeArrayList.size(); i++) {
                if (isConfidence) {
                    confidence = getConfidenceValue(edgeArrayList.get(i).getOrigin().getNodeType(), edgeArrayList.get(i).getDestination().getNodeType());
                    influence *= edgeArrayList.get(i).getInfluenceValue() * confidence;
                } else {
                    influence *= edgeArrayList.get(i).getInfluenceValue();
                }
            }
            return influence;
        }
        return (float)0.0;
    }

    public Path maxInfluencePath(Node source, Node target, Set<EdgeType> edgeTypeSet, boolean isConfidence) { //among all path which connect two node, return path which have maximum value of influence
//        ArrayList<Path> pathArrayList = pathSet(source, target, edgeTypeSet);
//        float max = 0;
//        int maxIndex = 0;
//        Path maxInfluencePath = null;
//
//        if (pathArrayList == null)
//            return null;
//        if (pathArrayList.size()!=0) {
//            for (int i = 0; i < pathArrayList.size(); i++) {
//                Path path = pathArrayList.get(i);
//                float influenceValue = influence(path, isConfidence);
//                path.setInfluenceValue(influenceValue);
//
//                if (influenceValue > max) {
//                    max = influenceValue;
//                    maxIndex = i;
//                    maxInfluencePath = path;
//                }
//            }
//            return maxInfluencePath;
//        }
//        return null;
        Path maxInfluencePath = new Path();

        for(Edge e : edgeSet) {
            if(e.getOrigin() == source) {
                System.out.println(e.getInfluenceValue());
                ArrayList<Edge> edgeArrayList = new ArrayList<>();
                edgeArrayList.add(e);
                findMaxInfluencePath(e.getDestination(), target, edgeArrayList, edgeTypeSet, isConfidence, e.getInfluenceValue(), maxInfluencePath);
            }
        }
        return maxInfluencePath;
    }

    public float maxInfluenceAvearge(Node n1, Node n2, Set<EdgeType> edgeTypeSet, boolean isConfidence) {
        float sum = 0;
        int totalNum = 0;
        float average = 0;
        for(EdgeType et : edgeTypeSet) {
            TreeSet<EdgeType> ets = new TreeSet<>();
            ets.add(et);
            Path p = newMaxInfluencePath(n1, n2, ets, isConfidence);
            if (p != null) {
                totalNum++;
                sum += p.getInfluenceValue();
            }
        }
        if(totalNum == 0)
            return 0;
        average = sum / totalNum;
        return average;
    }

    public ArrayList<Path> allMaxInfluencePath(Set<EdgeType> edgeTypeSet, boolean isConfidence, boolean isAverage) {
        System.out.println("Start Max Influence Table");
        ArrayList<Path> result = new ArrayList<>();
        for(Node n1 : nodeSet) {
            for(Node n2 : nodeSet) {
                if(n1 == n2) {
                    continue;
                }
                Path maxInfluencePath = maxInfluencePath(n1, n2, edgeTypeSet, isConfidence);
                if(maxInfluencePath != null) {
                    if(isAverage) {
                        float averageValue = maxInfluenceAvearge(n1, n2, edgeTypeSet, isConfidence);
                        maxInfluencePath.setInfluenceValue(averageValue);
                        result.add(maxInfluencePath);
                    } else
                        result.add(maxInfluencePath);
                }
            }
        }
        System.out.println("End Max Influence Table");
        return result;
    }

    public TreeMap<Float, Node> mostSumInfNode(int num, Set<EdgeType> edgeTypeSet, boolean isConfidence, boolean isAverage) {
        TreeMap<Float, Node> sumInfNodeMap = new TreeMap<>(Collections.reverseOrder());

        for(Node n1 : nodeSet) {
            float sum = 0;
            for(Node n2 : nodeSet) {
                if(n1 == n2) // except same node.
                    continue;
                Path path = newMaxInfluencePath(n1, n2, edgeTypeSet, isConfidence);
                if(path != null) {
                    if(isAverage) {
                        float averageValue = maxInfluenceAvearge(n1, n2, edgeTypeSet, isConfidence);
                        sum += averageValue;
                    } else
                        sum += path.getInfluenceValue();
                }

            }
            sumInfNodeMap.put(sum, n1);
        }

        TreeMap<Float, Node> result = new TreeMap<>(Collections.reverseOrder());
        int i = 0;
        for(Map.Entry<Float, Node> entry : sumInfNodeMap.entrySet()) {
            if(i == num)
                break;
            i++;
            float sumInf = entry.getKey();
            Node node = entry.getValue();
            result.put(sumInf, node);
        }
        return result;
    }

    public TreeMap<Float, Node> mostAvgInfNode(int num, Set<EdgeType> edgeTypeSet, boolean isConfidence, boolean isAverage) {
        TreeMap<Float, Node> sumInfNodeMap = mostSumInfNode(num, edgeTypeSet, isConfidence, isAverage);
        TreeMap<Float, Node> avgInfNodeMap = new TreeMap<>(Collections.reverseOrder());

        for(Map.Entry<Float, Node> entry : sumInfNodeMap.entrySet()) {
            float sumInf = entry.getKey();
            Node node = entry.getValue();
            float avgInf = sumInf / (nodeSet.size()-1); // except same node.
            avgInfNodeMap.put(avgInf, node);
        }
        return avgInfNodeMap;
    }

    /**
     * ETC Methods
     */

    /**
     * Print all set in graph. (nodeTypeSet, nodeSet, edgeSet, confidenceSet)
     */
    public void printGraph() {

        System.out.println("nodeTypeSet");
        Iterator<NodeType> iterator_NodeType = nodeTypeSet.iterator();
        while (iterator_NodeType.hasNext()) {
            NodeType nodetype = iterator_NodeType.next();
            System.out.println(nodetype.getColor() + '/' + nodetype.getName());
        }
        System.out.println("");
        System.out.println("nodeSet");
        Iterator<Node> iterator_Node = nodeSet.iterator();
        while (iterator_Node.hasNext()) {
            Node node = iterator_Node.next();
            System.out.println(node.getName() + '/' + node.getNodeType().getName() + '/' + node.getNodeType().getColor());
        }
        System.out.println("");
        System.out.println("edgeSet");
        Iterator<Edge> iterator_Edge = edgeSet.iterator();
        while (iterator_Edge.hasNext()) {
            Edge edge = iterator_Edge.next();
            System.out.println(edge.getOrigin().getName() + '/' + edge.getDestination().getName() + '/' + edge.getInfluenceValue());
        }
        System.out.println("");
        System.out.println("confidenceSet");
        Iterator<Confidence> iterator_Confidence = confidenceSet.iterator();
        while (iterator_Confidence.hasNext()) {
            Confidence confidence = iterator_Confidence.next();
            System.out.println(confidence.getOrigin().getName() + '/' + confidence.getDestination().getName() + '/' + confidence.getConfidenceValue());
        }
    }

    /**
     * load all set in graph from DB.
     *
     * @return isSuccess
     */
    public int load() {
        nodeTypeSet.addAll(nodeTypeDAO.getNodeTypeSet(id));
        confidenceSet.addAll(confidenceDAO.getConfidenceSet(id, nodeTypeSet));
        nodeSet.addAll(nodeDAO.getNodeSet(id, nodeTypeSet));
        edgeTypeSet.addAll(edgeTypeDAO.getEdgeTypeSet(id));
        edgeSet.addAll(edgeDAO.getEdgeSet(id, nodeSet, edgeTypeSet));

        /* set default edge type */
        for (EdgeType et : edgeTypeSet) {
            if(et.getName().equals("default") && et.getColor().equals("default")) {
                defaultEdgeType = et;
                break;
            }
        }
        return 0;
    }


    public Path newMaxInfluencePath(Node source, Node target, Set<EdgeType> edgeTypeSet, boolean isConfidence) { //among all path which connect two node, return path which have maximum value of influence

        ArrayList<Path> pathArrayList = new ArrayList<>();
        for (EdgeType et : edgeTypeSet) {
            HashMap<Node, ArrayList<Edge>> adjacencyList = getAdjacencyList(et);
            Path p = findMaxInfluencePath(source, target, isConfidence, adjacencyList);
            if(p != null)
                pathArrayList.add(p);
        }
        Path maxInfluencePath = new Path();
        if(target != null) {  // MaxInfluencePath.
            if(pathArrayList.isEmpty() == false) {
                for(Path p : pathArrayList) {
                    if(p.getInfluenceValue() > maxInfluencePath.getInfluenceValue()) {
                        maxInfluencePath = p;
                    }
                }
            } else
                return null;
        } else { // MaxInfluenceTable.
            if(pathArrayList.isEmpty() == false)
                maxInfluencePath = pathArrayList.get(0);
            else
                return null;
        }

        return maxInfluencePath;
    }

    public Path findMaxInfluencePath(Node source, Node target, boolean isConfidence, HashMap<Node, ArrayList<Edge>> adjacencyList) {

        /* Edge and Length Value */
        PriorityQueue<Map.Entry<Edge, Float>> priorityQueue = new PriorityQueue<>(1000, new Comparator<Map.Entry<Edge, Float>>() {
        @Override
        public int compare(Map.Entry<Edge, Float> a, Map.Entry<Edge, Float> b) {
            if(a.getValue() < b.getValue())
                return 1;
            else
                return -1;
        }
    });
        Set<Node> visited = new HashSet<>();
        visited.add(source);
        ArrayList<Edge> edgeofSourceList = adjacencyList.get(source); // add exception handling that edge of source is null
        for(Edge e : edgeofSourceList) {
            if(isConfidence) {
                priorityQueue.add(new AbstractMap.SimpleEntry<Edge, Float>(e, e.getInfluenceValue() * getConfidenceValue(e.getOrigin().getNodeType(), e.getDestination().getNodeType())));
            } else {
                priorityQueue.add(new AbstractMap.SimpleEntry<Edge, Float>(e, e.getInfluenceValue()));
            }
        }

        ArrayList<Edge> maxInfluenceEdgeList = new ArrayList<>();
        while(priorityQueue.isEmpty() == false) { // Queue is not empty
            Map.Entry<Edge, Float> entry = priorityQueue.poll();
            if(visited.contains(entry.getKey().getDestination())) {
                continue;
            }
            maxInfluenceEdgeList.add(entry.getKey());
            if(target != null) { // maxInfluencePath.
                if (entry.getKey().getDestination() == target) { // 최종 Path 찾음. 종료
                    Path maxInfluencePath = findOnePath(maxInfluenceEdgeList, source, target);
                    maxInfluencePath.setInfluenceValue(entry.getValue());
                    return maxInfluencePath;
                }
            } else { // maxInfluenceTable
                if(visited.size() == nodeSet.size()) {
                    Path maxInfluenceTablePaths = new Path(maxInfluenceEdgeList);
                    return maxInfluenceTablePaths;
                }
            }
            Node destination = entry.getKey().getDestination();
            visited.add(destination);
            ArrayList<Edge> edgeofNodeList = adjacencyList.get(destination);
            for(Edge e : edgeofNodeList) {
                if (visited.contains(e.getDestination()) == false) { // 아직 연결 되지 않은 노드와 연결되있는 엣지만 다시 넣는다.
                    if(isConfidence) {
                        priorityQueue.add(new AbstractMap.SimpleEntry<Edge, Float>(e, entry.getValue() * e.getInfluenceValue() * getConfidenceValue(e.getOrigin().getNodeType(), e.getDestination().getNodeType())));
                    } else {
                        priorityQueue.add(new AbstractMap.SimpleEntry<Edge, Float>(e, entry.getValue() * e.getInfluenceValue()));
                    }
                }
            }
        }
        if (target == null) { //maxInfluenceTable
            if(maxInfluenceEdgeList.size() != 0) {
                Path maxInfluenceTablePaths = new Path(maxInfluenceEdgeList);
                return maxInfluenceTablePaths;
            } else { // No Path.
                return null;
            }
        } else { // No Path.
            return null;
        }
    }

    public ArrayList<Path> maxInfluenceTable(Set<EdgeType> edgeTypeSet, boolean isConfidence, boolean isAverage) {
        System.out.println("Start Max Influence Table");
        ArrayList<Path> result = new ArrayList<>();
        for(Node n1 : nodeSet) {
            Path n1Paths = newMaxInfluencePath(n1, null, edgeTypeSet, isConfidence);
            if(n1Paths == null)
                continue;
            for(Node n2 : nodeSet) {
                if(n1 == n2)
                    continue;
                Path n1n2Path = findOnePath(n1Paths.getEdgeArrayList(), n1, n2);
                if(n1n2Path == null)
                    continue;
                n1n2Path.setInfluenceValue(influence(n1n2Path, isConfidence));
                if(n1n2Path != null) {
                    if(isAverage) {
                        float averageValue = maxInfluenceAvearge(n1, n2, edgeTypeSet, isConfidence);
                        n1n2Path.setInfluenceValue(averageValue);
                        result.add(n1n2Path);
                    } else
                        result.add(n1n2Path);
                }
            }
        }
        System.out.println("End Max Influence Table");
        return result;
    }

    public HashMap<Node, ArrayList<Edge>> getAdjacencyList(EdgeType edgeType) {
        HashMap<Node, ArrayList<Edge>> adjacencyList = new HashMap<>();
        for(Node n : nodeSet) {
            adjacencyList.put(n, new ArrayList<Edge>());
            for(Edge e : edgeSet) {
                if(edgeType == e.getEdgeType() && n == e.getOrigin()) {
                    adjacencyList.get(n).add(e);
                }
            }
        }
        return adjacencyList;
    }

    public Path findOnePath(ArrayList<Edge> edgeArrayList, Node source, Node target) {

        ArrayList<Edge> edgePathArrayList = new ArrayList<>(); // Return value.
        Edge edge = null;
        for(int j = edgeArrayList.size()-1; j >= 0; j--) { // Find last edge which include target node.
            if(edgeArrayList.get(j).getDestination() == target) {
                edge = edgeArrayList.get(j);
                edgePathArrayList.add(edge); // put last edge.
            }
        }
        if (edgePathArrayList.isEmpty()) { // No path.
           return null;
        }

        while (true) {
            if(edge.getOrigin() == source) {
                break;
            }
            for(int j = edgeArrayList.size()-1; j >= 0; j--) {
                if(edge.getOrigin() == edgeArrayList.get(j).getDestination()) {
                    edgePathArrayList.add(edgeArrayList.get(j));
                    edge = edgeArrayList.get(j);
                    break;
                }
            }
        }
        Collections.reverse(edgePathArrayList);
        Path maxInfluencePath = new Path(edgePathArrayList);
        return maxInfluencePath;
    }

    public static void main(String args[]) {

        InfluenceGraph a = new InfluenceGraph("graph2");
        a.setId(1);
//        a.load();
        Node A, B, C, D, E, F, G, H, I, J, K, L;
        NodeType Democracy, Communistic, Neutral;
        Democracy = new NodeType("blue", "Democracy");
		Communistic = new NodeType("red", "Communistic");
        Neutral = new NodeType("yellow", "Neutral");
		a.addNodeType(Democracy);
		a.addNodeType(Communistic);
		a.addNodeType(Neutral);

//        A = new Node(Democracy, "A",(float)240,(float)200);
//		B = new Node(Neutral, "B",(float)200,(float)220);
//		C = new Node(Democracy, "C",(float)250,(float)500);
//		D = new Node(Communistic, "D",(float)270,(float)320);
//		E = new Node(Democracy, "E",(float)320,(float)500);
//		F = new Node(Communistic, "F",(float)380,(float)400);
//		G = new Node(Communistic, "G",(float)450,(float)350);
//        H = new Node(Neutral, "H",(float)500,(float)250);
//		I = new Node(Democracy, "I",(float)650,(float)200);
//		J = new Node(Democracy, "J",(float)700,(float)250);
//		K = new Node(Democracy, "K",(float)400,(float)500);
//		L = new Node(Neutral, "L",(float)550,(float)250);
//
//		a.addNode(A);
//		a.addNode(B);
//		a.addNode(C);
//		a.addNode(D);
//		a.addNode(E);
//		a.addNode(F);
//		a.addNode(G);
//		a.addNode(H);
//		a.addNode(I);
//		a.addNode(J);
//		a.addNode(K);
//		a.addNode(L);
//
//		a.addEdge(new Edge(A,B,(float)0.5));
//		a.addEdge(new Edge(A,C,(float)0.9));
//		a.addEdge(new Edge(A,D,(float)0.6));
//		a.addEdge(new Edge(B,A,(float)0.4));
//		a.addEdge(new Edge(B,C,(float)0.85));
//		a.addEdge(new Edge(B,E,(float)0.85));
//		a.addEdge(new Edge(B,F,(float)0.95));
//		a.addEdge(new Edge(C,A,(float)0.95));
//		a.addEdge(new Edge(C,B,(float)0.85));
//		a.addEdge(new Edge(C,D,(float)0.7));
//		a.addEdge(new Edge(C,F,(float)0.4));
//		a.addEdge(new Edge(C,H,(float)0.45));
//		a.addEdge(new Edge(C,J,(float)0.3));
//		a.addEdge(new Edge(D,C,(float)0.8));
//		a.addEdge(new Edge(D,H,(float)0.85));
//		a.addEdge(new Edge(E,B,(float)0.3));
//		a.addEdge(new Edge(E,I,(float)0.95));
//		a.addEdge(new Edge(F,B,(float)0.8));
//		a.addEdge(new Edge(F,C,(float)0.3));
//		a.addEdge(new Edge(F,E,(float)0.55));
//		a.addEdge(new Edge(F,G,(float)0.3));
//		a.addEdge(new Edge(F,J,(float)0.4));
//		a.addEdge(new Edge(G,C,(float)0.75));
//		a.addEdge(new Edge(G,J,(float)0.4));
//		a.addEdge(new Edge(G,L,(float)0.6));
//		a.addEdge(new Edge(H,C,(float)0.45));
//		a.addEdge(new Edge(H,D,(float)0.7));
//		a.addEdge(new Edge(H,G,(float)0.7));
//		a.addEdge(new Edge(H,J,(float)0.75));
//		a.addEdge(new Edge(H,K,(float)0.6));
//		a.addEdge(new Edge(I,E,(float)0.7));
//		a.addEdge(new Edge(I,F,(float)0.9));
//		a.addEdge(new Edge(I,J,(float)0.8));
//		a.addEdge(new Edge(J,F,(float)0.6));
//		a.addEdge(new Edge(J,H,(float)0.9));
//		a.addEdge(new Edge(J,I,(float)0.7));
//		a.addEdge(new Edge(J,L,(float)0.3));
//		a.addEdge(new Edge(K,H,(float)0.4));
//		a.addEdge(new Edge(K,L,(float)1));
//		a.addEdge(new Edge(L,J,(float)0.3));
//		a.addEdge(new Edge(L,K,(float)1));
//
		a.addConfidence(new Confidence(Democracy, Communistic, (float)0.5));
		a.addConfidence(new Confidence(Democracy, Neutral, (float)0.6));
		a.addConfidence(new Confidence(Communistic, Democracy, (float)0.7));
		a.addConfidence(new Confidence(Communistic, Neutral, (float)0.4));
		a.addConfidence(new Confidence(Neutral, Democracy, (float)0.6));
		a.addConfidence(new Confidence(Neutral, Communistic, (float)0.8));

//        a.deleteNodeType(33);
//        a.updateNode(45, "asd", null);
//        a.updateNode(75,null, a.getNodeType(43));
//        a.updateInfluenceValue(a.getNode(86), a.getNode(85), (float)0.9);
//        a.deleteNode(44);

//        a.printGraph();
//
//        System.out.println("");
//        System.out.println("Path List");
//        ArrayList<Path> paths;
//        paths = a.pathSet(a.getNode(75), a.getNode(83));
//        for (int i = 0; i < paths.size(); i++) {
//            a.printPath(paths.get(i));
//            System.out.println(a.influence(paths.get(i)));
//        }
//
//        System.out.println('\n' + "Max Influence Path");
//        Path path = a.maxInfluencePath(a.getNode(75), a.getNode(83));
//        a.printPath(path);
//        System.out.println(a.influence(path));
//        System.out.println("");
    }
}
