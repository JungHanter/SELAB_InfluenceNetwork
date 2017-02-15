package kr.ac.ssu.soft.influencenetwork;

public class EdgeType implements Comparable<EdgeType> {
	private int id;
	private String color;
	private String name;

	public EdgeType(String color, String name) {
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
	public int compareTo(EdgeType et) {
		if (this==et) return 0;
		return id - et.getId();
	}
}
