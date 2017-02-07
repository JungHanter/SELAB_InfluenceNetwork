package kr.ac.ssu.soft.influencenetwork;

public class NodeType implements Comparable<NodeType> {
	private int id;
	private String color;
	private String name;
	
	public NodeType(String color, String name) {
		this.color = color;
		this.name = name;
	}
	public NodeType(int id,String color, String name) {
		this.id = id;
		this.color = color;
		this.name = name;

	}
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getColor() {
		return color;
	}

	public void setColor(String color) {
		this.color = color;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Override
	public int compareTo(NodeType o) {
		if (this==o) return 0;
		return id - o.getId();
	}
}
