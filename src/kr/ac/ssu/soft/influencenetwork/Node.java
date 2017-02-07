package kr.ac.ssu.soft.influencenetwork;

public class Node implements Comparable<Node> {
	private int id;
	private NodeType nt;
	private String name;


	public Node(NodeType nt, String name) {
		this.name = name;
		this.nt = nt;
	}
	public Node(int id, NodeType nt, String name) {
		this.id = id;
		this.nt = nt;
		this.name = name;
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

	public NodeType getNodeType() {
		return nt;
	}

	public void setNodeType(NodeType nt) {
		this.nt = nt;
	}

	@Override
	public int compareTo(Node o) {
		if (this==o) return 0;
		return id - o.getId();
	}
}
