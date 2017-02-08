package kr.ac.ssu.soft.influencenetwork;
import kr.ac.ssu.soft.influencenetwork.db.ConfidenceDAO;
import kr.ac.ssu.soft.influencenetwork.db.EdgeDAO;
import kr.ac.ssu.soft.influencenetwork.db.NodeDAO;
import kr.ac.ssu.soft.influencenetwork.db.NodeTypeDAO;

import java.util.ArrayList;
import java.util.Set;
import java.util.*;

public class InfluenceGraph {
    private int id;
    private String name;
    private String userEmail;

    private Set<NodeType> nodeTypeSet = new TreeSet<NodeType>();
    private Set<Node> nodeSet = new TreeSet<Node>();
    private Set<Edge> edgeSet = new TreeSet<Edge>();
    private Set<Confidence> confidenceSet = new TreeSet<Confidence>();

    private NodeTypeDAO nodeTypeDAO = new NodeTypeDAO();
    private NodeDAO nodeDAO = new NodeDAO();
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

    /**
     * Return a nodetype in nodeTypeSet which has same nodeTypeId.
     *
     * @param nodeTypeId    ID of node type to find.
     * @return NodeType     Node type which has same nodeTypeId.
     */
    public NodeType getNodeType(int nodeTypeId) {
        for (NodeType nt : nodeTypeSet) {
            if (nt.getId() == nodeTypeId) return nt;
        }
        return null;
    }

    public Set<NodeType> getNodeTypeSet() {
        return nodeTypeSet;
    }

    /* need to revise */
    public boolean updateNodeType(int nodeTypeId, String name, String color) {
        if (name == null && color == null)
            return false;
        for (NodeType nt : nodeTypeSet) {
            if (nt.getId() == nodeTypeId) {

                /** a backup of nt attributes for DB update failure. */
                String previousName = nt.getName();
                String previousColor = nt.getColor();

                if (name != null)
                    nt.setName(name);
                if (color != null)
                    nt.setColor(color);

                if (nodeTypeDAO.updateNodeType(nt))
                    return true;   // Successfully Update NodeType in DB

                /* revert nodetype in nodeTypeSet to previous state */
                nt.setName(previousName);
                nt.setColor(previousColor);
                return false;
            }
        }
        return false;
    }

    public boolean deleteNodeType(int nodeTypeId) {
        for (NodeType nt : nodeTypeSet) {
            if(nt.getId() == nodeTypeId) {
                if (nodeTypeSet.remove(nt)) {
                    Set<Node> updatedNodeSet = new TreeSet<>();
                    for (Node n : nodeSet) {
                        if (n.getNodeType().getId() == nodeTypeId) {
                            updatedNodeSet.add(n);
                            n.setNodeType(null);
                        }
                    }
                    Set<Confidence> deletedConfidenceSet = new TreeSet<Confidence>();
                    for (Confidence c : confidenceSet) {
                        if((c.getOrigin().getId() == nodeTypeId) || (c.getDestination().getId() == nodeTypeId)) {
                            deletedConfidenceSet.add(c);
//                            confidenceSet.remove(c);
                        }
                    }
                    confidenceSet.removeAll(deletedConfidenceSet);
                    if (nodeTypeDAO.deleteNodeType(nodeTypeId)) {
                        return true;
                    } else {
                        /* Revert deleted nodetype, node and confidences */
                        nodeTypeSet.add(nt);
                        for (Node n : updatedNodeSet) {
                            n.setNodeType(nt);
                        }
                        confidenceSet.addAll(deletedConfidenceSet);
                    }
                }
                return false;
            }
        }
        return false;
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

    /* need to revise */
    public boolean updateNode(int nodeId, String domainId, String name, NodeType nodeType, float x, float y) {
        if (name == null && nodeType == null)
            return false;
        for (Node n : nodeSet) {
            if (n.getId() == nodeId) {

                /** a backup of n attributes for DB update failure. */
                String previousDomainId = n.getDomainId();
                String previousName = n.getName();
                NodeType previousNodeType = n.getNodeType();

                if (domainId != null)
                    n.setDomainId(domainId);
                if (name != null)
                   n.setName(name);
                if (nodeType != null)
                   n.setNodeType(nodeType);

                if (nodeDAO.updateNode(n))
                    return true;

                n.setDomainId(previousDomainId);
                n.setName(previousName);
                n.setNodeType(previousNodeType);
                return false;
            }
        }
        return false;
    }

    /**
     * Return success or failure of delete node in nodeSet and DB.
     *
     * @param nodeId        Node ID to delete node
     * @return isSuccess    success or failure for deleting
     */
    public boolean deleteNode(int nodeId) {
        for (Node n : nodeSet) {
            if(n.getId() == nodeId) {
                if (nodeSet.remove(n)) {
                    Set<Edge> deletedEdgeSet = new TreeSet<Edge>();
                    for (Edge e : edgeSet) {
                        if ((e.getOrigin().getId() == nodeId) || (e.getDestination().getId() == nodeId)) {
                            deletedEdgeSet.add(e);
                        }
                    }

                    /* Delete edges connected with deleted node */
                    edgeSet.removeAll(deletedEdgeSet);

                    if (nodeDAO.deleteNode(nodeId)) {
                        return true;
                    }

                    /* Revert deleted node and edges */
                    nodeSet.add(n);
                    edgeSet.addAll(deletedEdgeSet);
                }
                return false;
            }
        }
        return false;
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

    public Edge getEdge(Node n1, Node n2) {
        for (Edge e : edgeSet) {
            if (e.getOrigin() == n1 && e.getDestination() == n2)
                return e;
        }
        return null;
    }

    public boolean updateInfluenceValue(Node n1, Node n2, float influenceValue) {
        if (influenceValue > 1 && influenceValue < 0)
            return false;
        for (Edge e : edgeSet) {
            if((e.getOrigin().getId() == n1.getId()) && (e.getDestination().getId() == n2.getId())) {
                float previousInfluenceValue = e.getInfluenceValue();

                e.setInfluenceValue(influenceValue);
                if (edgeDAO.updateEdge(n1, n2, influenceValue)) {
                    return true;
                }
                e.setInfluenceValue(previousInfluenceValue);
                return false;
            }
        }
        return false;
    }

    public boolean deleteEdge(Node n1, Node n2) {
        for (Edge e : edgeSet) {
            if((e.getOrigin().getId() == n1.getId()) && (e.getDestination().getId() == n2.getId())) {
                if (edgeSet.remove(e)) {
                    if (edgeDAO.deleteEdge(n1, n2)) {
                        return true;
                    }
                    edgeSet.add(e);
                }
                return false;
            }
        }
        return false;
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

    public boolean updateConfidenceValue(NodeType nt1, NodeType nt2, float confidenceValue) {
        if (confidenceValue > 1 && confidenceValue < 0)
            return false;
        for (Confidence c : confidenceSet) {
            if((c.getOrigin().getId() == nt1.getId()) && (c.getDestination().getId() == nt2.getId())) {
                float previousConfidenceValue = c.getConfidenceValue();

                c.setConfidenceValue(confidenceValue);
                if (confidenceDAO.updateConfidence(nt1, nt2, confidenceValue)) {
                    return true;
                }
                c.setConfidenceValue(previousConfidenceValue);
                return false;
            }
        }
        return false;
    }

    public boolean deleteConfidence(NodeType nt1, NodeType nt2) { //delete one Confidence
        for (Confidence c : confidenceSet) {
            if((c.getOrigin().getId() == nt1.getId()) && (c.getDestination().getId() == nt2.getId())) {
                if (confidenceSet.remove(c)) {
                    if (confidenceDAO.deleteConfidence(nt1, nt2)) {
                        return true;
                    }
                    confidenceSet.add(c);
                }
                return false;
            }
        }
        return false;
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
     * Path Methods
     */

    /**
     * Return pathList from source to target node. This method call findPathSet method.
     *
     * @param source       Source node of pathList.
     * @param target       Target node of pathList.
     * @return pathList    All paths from source to target.
     */
    public ArrayList<Path> pathSet(Node source, Node target) {
        ArrayList<Path> pathArrayList = new ArrayList<Path>();

        findPathSet(source, target, new ArrayList<Edge>(), pathArrayList);

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
    public void findPathSet(Node next, Node target, ArrayList<Edge> edgelist, ArrayList<Path> pathlist) {

        /* Exit Condition of Recursive Function */
		if(next == target) {
            Path path = new Path(edgelist);
            pathlist.add(path);
            return;
        } else {

            /* To find edge connected with node*/
		    for (Edge e : edgeSet) {
		        if(e.getOrigin() == next) {
                    boolean cycle = false;

                    /* To check cycle in edgelist */
                    for (Edge eg : edgelist) {
                        if (e.getDestination() == eg.getOrigin()) {
                            cycle = true;
                            break;
                        }
                    }
                    if (cycle==false) {
                        ArrayList<Edge> new_edgelist = new ArrayList<Edge>();
                        new_edgelist.addAll(edgelist);
                        new_edgelist.add(e);
                        findPathSet(e.getDestination(), target, new_edgelist, pathlist);
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

    public float influence(Path path) { //return influence value of path
        ArrayList<Edge> edgeArrayList = path.getEdgeArrayList();
        if (edgeArrayList != null) {
            float influence = 1;
            float confidence = 1;
            for (int i = 0; i < edgeArrayList.size(); i++) {
                confidence = getConfidenceValue(edgeArrayList.get(i).getOrigin().getNodeType(), edgeArrayList.get(i).getDestination().getNodeType());
                influence *= edgeArrayList.get(i).getInfluenceValue() * confidence;
            }
            return influence;
        }
        return (float)0.0;
    }

    public Path maxInfluencePath(Node source, Node target) { //among all path which connect two node, return path which have maximum value of influence
        ArrayList<Path> pathArrayList = pathSet(source, target);
        float max = 0;
        int maxIndex = 0;
        Path maxInfluencePath;

        if (pathArrayList.size()!=0) {
            for (int i = 0; i < pathArrayList.size(); i++) {
                float temp = influence(pathArrayList.get(i));
                if (temp > max) {
                    max = temp;
                    maxIndex = i;
                }
            }
            maxInfluencePath = pathArrayList.get(maxIndex);
            return maxInfluencePath;
        }
        return null;
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
        edgeSet.addAll(edgeDAO.getEdgeSet(id, nodeSet));

        return 0;
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

        A = new Node(Democracy, "A",(float)240,(float)200);
		B = new Node(Neutral, "B",(float)200,(float)220);
		C = new Node(Democracy, "C",(float)250,(float)500);
		D = new Node(Communistic, "D",(float)270,(float)320);
		E = new Node(Democracy, "E",(float)320,(float)500);
		F = new Node(Communistic, "F",(float)380,(float)400);
		G = new Node(Communistic, "G",(float)450,(float)350);
        H = new Node(Neutral, "H",(float)500,(float)250);
		I = new Node(Democracy, "I",(float)650,(float)200);
		J = new Node(Democracy, "J",(float)700,(float)250);
		K = new Node(Democracy, "K",(float)400,(float)500);
		L = new Node(Neutral, "L",(float)550,(float)250);

		a.addNode(A);
		a.addNode(B);
		a.addNode(C);
		a.addNode(D);
		a.addNode(E);
		a.addNode(F);
		a.addNode(G);
		a.addNode(H);
		a.addNode(I);
		a.addNode(J);
		a.addNode(K);
		a.addNode(L);

		a.addEdge(new Edge(A,B,(float)0.5));
		a.addEdge(new Edge(A,C,(float)0.9));
		a.addEdge(new Edge(A,D,(float)0.6));
		a.addEdge(new Edge(B,A,(float)0.4));
		a.addEdge(new Edge(B,C,(float)0.85));
		a.addEdge(new Edge(B,E,(float)0.85));
		a.addEdge(new Edge(B,F,(float)0.95));
		a.addEdge(new Edge(C,A,(float)0.95));
		a.addEdge(new Edge(C,B,(float)0.85));
		a.addEdge(new Edge(C,D,(float)0.7));
		a.addEdge(new Edge(C,F,(float)0.4));
		a.addEdge(new Edge(C,H,(float)0.45));
		a.addEdge(new Edge(C,J,(float)0.3));
		a.addEdge(new Edge(D,C,(float)0.8));
		a.addEdge(new Edge(D,H,(float)0.85));
		a.addEdge(new Edge(E,B,(float)0.3));
		a.addEdge(new Edge(E,I,(float)0.95));
		a.addEdge(new Edge(F,B,(float)0.8));
		a.addEdge(new Edge(F,C,(float)0.3));
		a.addEdge(new Edge(F,E,(float)0.55));
		a.addEdge(new Edge(F,G,(float)0.3));
		a.addEdge(new Edge(F,J,(float)0.4));
		a.addEdge(new Edge(G,C,(float)0.75));
		a.addEdge(new Edge(G,J,(float)0.4));
		a.addEdge(new Edge(G,L,(float)0.6));
		a.addEdge(new Edge(H,C,(float)0.45));
		a.addEdge(new Edge(H,D,(float)0.7));
		a.addEdge(new Edge(H,G,(float)0.7));
		a.addEdge(new Edge(H,J,(float)0.75));
		a.addEdge(new Edge(H,K,(float)0.6));
		a.addEdge(new Edge(I,E,(float)0.7));
		a.addEdge(new Edge(I,F,(float)0.9));
		a.addEdge(new Edge(I,J,(float)0.8));
		a.addEdge(new Edge(J,F,(float)0.6));
		a.addEdge(new Edge(J,H,(float)0.9));
		a.addEdge(new Edge(J,I,(float)0.7));
		a.addEdge(new Edge(J,L,(float)0.3));
		a.addEdge(new Edge(K,H,(float)0.4));
		a.addEdge(new Edge(K,L,(float)1));
		a.addEdge(new Edge(L,J,(float)0.3));
		a.addEdge(new Edge(L,K,(float)1));

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

        a.printGraph();

        System.out.println("");
        System.out.println("Path List");
        ArrayList<Path> paths;
        paths = a.pathSet(a.getNode(75), a.getNode(83));
        for (int i = 0; i < paths.size(); i++) {
            a.printPath(paths.get(i));
            System.out.println(a.influence(paths.get(i)));
        }

        System.out.println('\n' + "Max Influence Path");
        Path path = a.maxInfluencePath(a.getNode(75), a.getNode(83));
        a.printPath(path);
        System.out.println(a.influence(path));
        System.out.println("");
    }
}
