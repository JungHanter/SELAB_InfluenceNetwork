package kr.ac.ssu.soft.influencenetwork;

public class Edge implements Comparable<Edge> {
	private Node n1;
	private Node n2;
	private float influenceValue;
	
	public Edge(Node n1, Node n2, float influenceValue) {
		this.n1 = n1;
		this.n2 = n2;
		this.influenceValue = influenceValue;
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
			return n2.compareTo(o.n2);
		} else {
			return comp;
		}
	}
}
