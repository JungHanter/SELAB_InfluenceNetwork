package kr.ac.ssu.soft.influencenetwork;

public class Edge implements Comparable<Edge> {
	private EdgeType edgeType;
	private Node n1;
	private Node n2;
	private float influenceValue;
	
	public Edge(Node n1, Node n2, float influenceValue) {
		this.n1 = n1;
		this.n2 = n2;
		this.influenceValue = influenceValue;
	}

	public Edge(EdgeType edgeType, Node n1, Node n2, float influenceValue) {
		this.edgeType = edgeType;
		this.n1 = n1;
		this.n2 = n2;
		this.influenceValue = influenceValue;
	}

	public EdgeType getEdgeType() {
		return edgeType;
	}

	public void setEdgeType(EdgeType edgeType) {
		this.edgeType = edgeType;
	}

	public Node getOrigin() {
		return n1;
	}

	public Node getDestination() {
		return n2;
	}

	public float getInfluenceValue() {
		return influenceValue;
	}

	public void setInfluenceValue(float influenceValue) {
		this.influenceValue = influenceValue;
	}

	@Override
	public int compareTo(Edge o) {
		// TODO Auto-generated method stub
		if (this == o) return 0;
		int comp = n1.compareTo(o.n1);
		if (comp == 0) {
			int comp2 = n2.compareTo(o.n2);
			if(comp2 == 0) {
				return edgeType.compareTo(o.edgeType);
			} else {
				return comp2;
			}
		} else {
			return comp;
		}
	}
}
