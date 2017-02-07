package kr.ac.ssu.soft.influencenetwork;

public class Confidence implements Comparable<Confidence> {
	private NodeType nt1;
	private NodeType nt2;
	private float confidenceValue;
	
	public Confidence(NodeType nt1, NodeType nt2, float confidenceValue) {
		this.nt1 = nt1;
		this.nt2 = nt2;
		this.confidenceValue = confidenceValue;
	}
	
	public NodeType getOrigin() {
		return nt1;
	}

	public NodeType getDestination() {
		return nt2;
	}

	public float getConfidenceValue() {
		return confidenceValue;
	}

	public void setConfidenceValue(float confidenceValue) {
		this.confidenceValue = confidenceValue;
	}

	@Override
	public int compareTo(Confidence c) {
		if (this == c) return 0;
		int comp = nt1.compareTo(c.nt1);
		if (comp == 0) {
			return nt2.compareTo(c.nt2);
		} else {
			return comp;
		}
	}
}
