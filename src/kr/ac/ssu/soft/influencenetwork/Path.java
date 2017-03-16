package kr.ac.ssu.soft.influencenetwork;

import java.util.ArrayList;

public class Path {
	private String dateUpdated; //need change type from string to datetime
	private ArrayList<Edge> edgeArrayList = null;
	private float influenceValue = 0;

	public Path(){}
	public Path(ArrayList<Edge> edgeArrayList)
	{
		this.edgeArrayList = edgeArrayList;
	}

	public String getDateUpdated() {
		return dateUpdated;
	}

	public void setDateUpdated(String dateUpdated) {
		this.dateUpdated = dateUpdated;
	}

	public ArrayList<Edge> getEdgeArrayList() {
		if(edgeArrayList != null)
			return edgeArrayList;
		else
			return null;
	}

	public void setEdgeArrayList(ArrayList<Edge> edgeArrayList) {
		this.edgeArrayList = edgeArrayList;
	}

	public float getInfluenceValue() {
		return influenceValue;
	}

	public void setInfluenceValue(float totalInfluenceValue) {
		this.influenceValue = totalInfluenceValue;
	}

	public Node getOriginNode () {
		return edgeArrayList.get(0).getOrigin();
	}

	public Node getDestinationNode() {
		return edgeArrayList.get(edgeArrayList.size()-1).getDestination();
	}
}
