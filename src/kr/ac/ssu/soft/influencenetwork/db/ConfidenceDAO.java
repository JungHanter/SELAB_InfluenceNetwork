package kr.ac.ssu.soft.influencenetwork.db;

import kr.ac.ssu.soft.influencenetwork.Confidence;
import kr.ac.ssu.soft.influencenetwork.NodeType;

import java.sql.*;
import java.util.*;

public class ConfidenceDAO {
	private Connection conn = null;
	private PreparedStatement pstmt = null;
	private Statement stmt = null;

	public static int SUCCESS = 0;
	public static int ERROR_CONNECTION = 1;
	public static int ERROR_DUPLICATION = 2;
	public static int ERROR_UNKNOWN = 9;
	public static int UNVALID_VALUE = 10;
	
	public int saveConfidence(Confidence confidence, int graph_id) {
		conn = DBManager.getConnection();
		String sql = "insert into confidence(n1_type_id, n2_type_id, confidenceValue, graph_id) " +
				"values(?,?,?,?)";
		
		try{
			pstmt = conn.prepareStatement(sql);
			pstmt.setInt(1, confidence.getOrigin().getId());
			pstmt.setInt(2, confidence.getDestination().getId());
			pstmt.setFloat(3, confidence.getConfidenceValue());
			pstmt.setInt(4, graph_id);
			pstmt.executeUpdate();
			DBManager.closeConnection(conn, pstmt);
			return SUCCESS;
		} catch (SQLException e){
			e.printStackTrace();
			DBManager.closeConnection(conn, pstmt);
			System.out.println(e.getErrorCode() + " " + e.getMessage());
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

	public Set<Confidence> getConfidenceSet(int graph_id, Set<NodeType> nodeTypeSet) {
		Set<Confidence> ConfidenceSet = new TreeSet<>();
		
		conn = DBManager.getConnection();
		
		String sql = "SELECT n1_type_id, n2_type_id, confidenceValue FROM confidence WHERE graph_id=" + graph_id;
		try{
			stmt = conn.createStatement();
			ResultSet rs = stmt.executeQuery(sql);

			while(rs.next()) {
				int n1TypeId = rs.getInt(1);
				int n2TypeId = rs.getInt(2);
				float confidenceValue = rs.getFloat(3);

				NodeType nt1=null, nt2 = null;
				for(NodeType nt : nodeTypeSet){
					if(nt.getId() == n1TypeId)
						nt1 = nt;
					else if(nt.getId() == n2TypeId)
						nt2 = nt;
				}

				Confidence confidence = new Confidence(nt1, nt2, confidenceValue);
				ConfidenceSet.add(confidence);
			}
			DBManager.closeConnection(conn, stmt);
			return ConfidenceSet;
		} catch(SQLException e){
			e.printStackTrace();
			DBManager.closeConnection(conn, stmt);
			return null;
		}
	}

	public boolean updateConfidence(NodeType nt1, NodeType nt2, float confidenceValue) {
		if(confidenceValue < 0 && confidenceValue > 1)
			return false;

		conn = DBManager.getConnection();
		String sql = "UPDATE confidence SET confidenceValue = ? WHERE n1_type_id=? AND n2_type_id=?";

		try {
			pstmt = conn.prepareStatement(sql);
			pstmt.setFloat(1, confidenceValue);
			pstmt.setInt(2, nt1.getId());
			pstmt.setInt(3, nt2.getId());
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
	public boolean deleteConfidence(NodeType nt1, NodeType nt2){
		conn = DBManager.getConnection();
		String sql = "DELETE FROM confidence WHERE n1_type_id=? and n2_type_id=?";
		
		try{
			pstmt = conn.prepareStatement(sql);
			pstmt.setInt(1, nt1.getId());
			pstmt.setInt(2, nt2.getId());
			pstmt.executeUpdate();
			DBManager.closeConnection(conn, pstmt);
			return true;
		} catch (SQLException e){
			e.printStackTrace();
			DBManager.closeConnection(conn, pstmt);
			System.out.println(e.getErrorCode() + " " + e.getMessage());
			return false;
		}		
	}
}
