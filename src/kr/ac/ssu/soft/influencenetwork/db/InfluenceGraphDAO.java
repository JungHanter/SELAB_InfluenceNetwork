package kr.ac.ssu.soft.influencenetwork.db;

import kr.ac.ssu.soft.influencenetwork.InfluenceGraph;
import java.sql.*;
import java.util.*;

public class InfluenceGraphDAO {
	private Connection conn = null;
	private PreparedStatement pstmt = null;
	private Statement stmt = null;
	private ResultSet rs = null;

	public static int SUCCESS = 0;
	public static int ERROR_CONNECTION = 1;
	public static int ERROR_DUPLICATION = 2;
	public static int ERROR_UNKNOWN = 9;
	public static int UNVALID_VALUE = 10;

	public int saveInfluenceGraph(InfluenceGraph ig) {
		
		conn = DBManager.getConnection();
		String sql = "insert into influencegraph(name, user_email) values(?,?)";
		
		try {
			pstmt = conn.prepareStatement(sql, Statement. RETURN_GENERATED_KEYS);
			pstmt.setString(1, ig.getName());
			pstmt.setString(2, ig.getUserEmail());
			pstmt.executeUpdate();
			rs = pstmt.getGeneratedKeys();
			if(rs != null && rs.next()){
				int id = rs.getInt(1);
				ig.setId(id);
			}
			DBManager.closeConnection(conn, pstmt);
			return SUCCESS;
		} catch(SQLException e) {
			e.printStackTrace();
			System.out.println(e.getErrorCode() + " " + e.getMessage());
			DBManager.closeConnection(conn, pstmt);
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

	public ArrayList<InfluenceGraph> getInfluenceGraphList(String userEmail){
		ArrayList<InfluenceGraph> influencegraph = new ArrayList<>();
		conn = DBManager.getConnection();
		String sql = "SELECT id, name, user_email FROM influencegraph WHERE user_email=? ORDER BY name";
		try{
			pstmt = conn.prepareStatement(sql);
			pstmt.setString(1, userEmail);
			rs = pstmt.executeQuery();
			while(rs.next()) {
				int id = rs.getInt(1);
				String name = rs.getString(2);
				String email = rs.getString(3);
				InfluenceGraph temp_influencegraph = new InfluenceGraph(id, name, email);
				influencegraph.add(temp_influencegraph);
			}
			return influencegraph;
		}catch(SQLException e) {
			e.printStackTrace();
			System.out.println(e.getErrorCode() + " " + e.getMessage());
			DBManager.closeConnection(conn, stmt);
		}
		return null;
	}
	public InfluenceGraph getInfluenceGraph(int graphId) {
		conn = DBManager.getConnection();
		String sql = "SELECT id, name FROM influencegraph WHERE id="+graphId;
		try {
			stmt = conn.createStatement();
			rs = stmt.executeQuery(sql);
			if (rs != null && rs.next()) {
				int id = rs.getInt(1);
				String name = rs.getString(2);
				InfluenceGraph temp_influencegraph = new InfluenceGraph(name);
				temp_influencegraph.setId(id);
				return temp_influencegraph;
			}
			return null;
		} catch(SQLException e) {
			e.printStackTrace();
			System.out.println(e.getErrorCode() +" " + e.getMessage());
			DBManager.closeConnection(conn, stmt);
			return null;
		}
	}
	public int updateInfluenceGraph(InfluenceGraph influencegraph, String name) {
		conn = DBManager.getConnection();
		String sql = "UPDATE influencegraph SET name="+name;
		try {
			stmt = conn.createStatement();
			stmt.executeUpdate(sql);
			DBManager.closeConnection(conn,stmt);
			return SUCCESS;
		} catch (SQLException e) {
			e.printStackTrace();
			System.out.println(e.getErrorCode() +" " + e.getMessage());
			DBManager.closeConnection(conn, stmt);
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
	public int deleteInfluenceGraph(int graphId) {
		
		conn = DBManager.getConnection();
		String sql = "DELETE FROM influencegraph WHERE id=" + graphId;
		
		try{
			stmt = conn.createStatement();
			stmt.executeUpdate(sql);
			DBManager.closeConnection(conn,stmt);
			return SUCCESS;
		} catch(SQLException e) {
			e.printStackTrace();
			DBManager.closeConnection(conn,stmt);
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
}
