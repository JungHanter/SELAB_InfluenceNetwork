package kr.ac.ssu.soft.influencenetwork;

public class Node implements Comparable<Node> {
	private int id;
	private String domainId;
	private NodeType nt;
	private String name;
	private float x = 100;
	private float y = 100;

	public Node(NodeType nt, String name) {
		this.name = name;
		this.nt = nt;
	}

	public Node(String domainId, NodeType nt, String name) {
		this.domainId = domainId;
		this.nt = nt;
		this.name = name;
	}

	public Node(NodeType nt, String name, float x, float y) {
		this.nt = nt;
		this.name = name;
		this.x = x;
		this.y = y;
	}

	public Node(String domainId, NodeType nt, String name, float x, float y) {
		this.domainId = domainId;
		this.nt = nt;
		this.name = name;
		this.x = x;
		this.y = y;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getDomainId() {
		return domainId;
	}

	public void setDomainId(String domainId) {
		this.domainId = domainId;
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

	public float getX() {
		return x;
	}

	public void setX(float x) {
		this.x = x;
	}

	public float getY() {
		return y;
	}

	public void setY(float y) {
		this.y = y;
	}

	@Override
	public int compareTo(Node o) {
		if (this==o) return 0;
		return id - o.getId();
	}
}
