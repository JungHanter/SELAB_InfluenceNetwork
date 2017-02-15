package kr.ac.ssu.soft.influencenetwork.db;


import kr.ac.ssu.soft.influencenetwork.Edge;
import kr.ac.ssu.soft.influencenetwork.EdgeType;
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
		String sql = "insert into edge(n1_id, n2_id, type_id, influenceValue, graph_id) " +
				"values(?,?,?,?,?)";
		
		try{
			pstmt = conn.prepareStatement(sql);
			pstmt.setInt(1, edge.getOrigin().getId());
			pstmt.setInt(2, edge.getDestination().getId());
			if(edge.getEdgeType() != null)
				pstmt.setInt(3, edge.getEdgeType().getId());
			else
				pstmt.setInt(3, -1);
			pstmt.setFloat(4, edge.getInfluenceValue());
			pstmt.setInt(5, graph_id);
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

	public Set<Edge> getEdgeSet(int graph_id, Set<Node> nodeSet, Set<EdgeType> edgeTypeSet) {
		Set<Edge> EdgeSet = new TreeSet<>();
		
		conn = DBManager.getConnection();
		String sql = "SELECT n1_id, n2_id, type_id, influenceValue FROM edge WHERE graph_id=" + graph_id;
		try{
			stmt = conn.createStatement();
			ResultSet rs = stmt.executeQuery(sql);
			while(rs.next()) {
				int n1_id = rs.getInt(1);
				int n2_id = rs.getInt(2);
				int type_id = rs.getInt(3);
				float influenceValue = rs.getFloat(4);
				Node n1 = null, n2 = null;
				EdgeType edgeType = null;

                for (EdgeType et : edgeTypeSet) {
                    if (type_id == et.getId()) {
                        edgeType = et;
                    }
                }

				for (Node node : nodeSet) {
					if(node.getId() == n1_id)
						n1 = node;
					if(node.getId() == n2_id)
						n2 = node;
				}

				Edge edge = new Edge(edgeType, n1, n2, influenceValue);
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

	public boolean updateEdge(Node n1, Node n2, EdgeType edgeType, float influenceValue) {
		if(influenceValue < 0 && influenceValue > 1)
			return false;

		conn = DBManager.getConnection();
		String sql = "UPDATE edge SET influenceValue = ? WHERE n1_id=? AND n2_id=? AND type_id=?";

		try {
			pstmt = conn.prepareStatement(sql);
			pstmt.setFloat(1, influenceValue);
			pstmt.setInt(2, n1.getId());
			pstmt.setInt(3, n2.getId());
			if(edgeType == null) {
//				EdgeTypeDAO edgeTypeDAO = new EdgeTypeDAO();
				pstmt.setInt(4, -1);
			}
			else
				pstmt.setInt(4, edgeType.getId());
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

	public boolean deleteEdge(Node n1, Node n2, EdgeType edgeType) {
		
		conn = DBManager.getConnection();
		String sql = "DELETE FROM edge WHERE n1_id = ? AND n2_id = ? AND type_id = ?";
		
		try {
			pstmt = conn.prepareStatement(sql);
			pstmt.setInt(1, n1.getId());
			pstmt.setInt(2, n2.getId());
			if(edgeType == null)
				pstmt.setInt(3, -1);
			else
				pstmt.setInt(3, edgeType.getId());
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
