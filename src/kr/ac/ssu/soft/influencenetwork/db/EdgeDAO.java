package kr.ac.ssu.soft.influencenetwork.db;


import kr.ac.ssu.soft.influencenetwork.Edge;
import kr.ac.ssu.soft.influencenetwork.Node;
import java.sql.*;
import java.util.*;


public class EdgeDAO {
	public static int SUCCESS = 0;
	public static int ERROR_CONNECTION = 1;
	public static int ERROR_DUPLICATION = 2;
	public static int ERROR_UNKNOWN = 9;
	public static int UNVALID_VALUE = 10;

	private Connection conn = null;
	private PreparedStatement pstmt = null;
	private Statement stmt = null;

	public int saveEdge(Edge edge, int graph_id) {
		
		conn = DBManager.getConnection();
		String sql = "insert into edge(n1_id, n2_id, influenceValue, graph_id) " +
				"values(?,?,?,?)";
		
		try{
			pstmt = conn.prepareStatement(sql);
			pstmt.setInt(1, edge.getOrigin().getId());
			pstmt.setInt(2, edge.getDestination().getId());
			pstmt.setFloat(3, edge.getInfluenceValue());
			pstmt.setInt(4, graph_id);
			pstmt.executeUpdate();
			DBManager.closeConnection(conn, pstmt);
			return SUCCESS;
		} catch (SQLException e){
			e.printStackTrace();
			DBManager.closeConnection(conn, pstmt);
			System.out.println(e.getErrorCode() +" " + e.getMessage());
			switch (e.getErrorCode()) {
				case 1129 :
					return ERROR_CONNECTION;
				case 1169 :
					return ERROR_DUPLICATION;
				default:
					return ERROR_UNKNOWN;
			}
		}		
	}

	public int saveEdge(int n1id, int n2id, float influenceValue, int typeId, int graphId) {

		conn = DBManager.getConnection();
		String sql = "insert into edge(n1_id, n2_id, influenceValue, type_id, graph_id) " +
				"values(?,?,?,?,?)";

		try{
			pstmt = conn.prepareStatement(sql);
			pstmt.setInt(1, n1id);
			pstmt.setInt(2, n2id);
			pstmt.setFloat(3, influenceValue);
			pstmt.setInt(4, typeId);
			pstmt.setInt(5, graphId);
			pstmt.executeUpdate();
			DBManager.closeConnection(conn, pstmt);
			return SUCCESS;
		} catch (SQLException e){
			e.printStackTrace();
			DBManager.closeConnection(conn, pstmt);
			System.out.println(e.getErrorCode() +" " + e.getMessage());
			switch (e.getErrorCode()) {
				case 1129 :
					return ERROR_CONNECTION;
				case 1169 :
					return ERROR_DUPLICATION;
				default:
					return ERROR_UNKNOWN;
			}
		}
	}

	public Set<Edge> getEdgeSet(int graph_id, Set<Node> nodeSet) {
		Set<Edge> EdgeSet = new TreeSet<>();
		
		conn = DBManager.getConnection();
		String sql = "SELECT n1_id, n2_id, influenceValue FROM edge WHERE graph_id=" + graph_id;
		try{
			stmt = conn.createStatement();
			ResultSet rs = stmt.executeQuery(sql);
			while(rs.next()) {
				int n1_id = rs.getInt(1);
				int n2_id = rs.getInt(2);
				float influenceValue = rs.getFloat(3);
				Node n1 = null, n2 = null;

				for(Node node : nodeSet){
					if(node.getId() == n1_id)
						n1 = node;
					if(node.getId() == n2_id)
						n2 = node;
				}

				Edge edge = new Edge(n1, n2, influenceValue);
				EdgeSet.add(edge);
			}
			DBManager.closeConnection(conn, stmt);
			return EdgeSet;
		} catch(SQLException e){
			e.printStackTrace();
			DBManager.closeConnection(conn, stmt);
			return null;
		}
	}

	public boolean updateEdge(Node n1, Node n2, float influenceValue) {
		if(influenceValue < 0 && influenceValue > 1)
			return false;

		conn = DBManager.getConnection();
		String sql = "UPDATE edge SET influenceValue = ? WHERE n1_id=? AND n2_id=?";

		try {
			pstmt = conn.prepareStatement(sql);
			pstmt.setFloat(1, influenceValue);
			pstmt.setInt(2, n1.getId());
			pstmt.setInt(3, n2.getId());
			pstmt.executeUpdate();
			DBManager.closeConnection(conn, pstmt);
			return true;
		} catch(SQLException e) {
			e.printStackTrace();
			System.out.println(e.getErrorCode() +" " + e.getMessage());
			DBManager.closeConnection(conn, pstmt);
			return false;
		}
	}

	public boolean deleteEdge(Node n1, Node n2) {
		
		conn = DBManager.getConnection();
		String sql = "DELETE FROM edge WHERE n1_id=? and n2_id=?";
		
		try {
			pstmt = conn.prepareStatement(sql);
			pstmt.setInt(1, n1.getId());
			pstmt.setInt(2, n2.getId());
			pstmt.executeUpdate();
			DBManager.closeConnection(conn, pstmt);
			return true;
		} catch (SQLException e) {
			e.printStackTrace();
			DBManager.closeConnection(conn, pstmt);
			System.out.println(e.getErrorCode() +" " + e.getMessage());
			return false;
		}		
	}
}
