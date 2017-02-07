package kr.ac.ssu.soft.influencenetwork.db;

import kr.ac.ssu.soft.influencenetwork.InfluenceGraph;
import java.sql.*;
import java.util.*;

public class InfluenceGraphDAO {
	private Connection conn = null;
	private Statement stmt = null;
	private ResultSet rs = null;

	public static int SUCCESS = 0;
	public static int ERROR_CONNECTION = 1;
	public static int ERROR_DUPLICATION = 2;
	public static int ERROR_UNKNOWN = 9;
	public static int UNVALID_VALUE = 10;

	public int saveInfluenceGraph(InfluenceGraph ig) {
		
		conn = DBManager.getConnection();
		String sql = "insert into influencegraph(name) values(\""+ ig.getName() +"\")";
		
		try {
			stmt = conn.createStatement();
			stmt.executeUpdate(sql);
			rs = stmt.getGeneratedKeys();
			if(rs != null && rs.next()){
				int id = rs.getInt(1);
				ig.setId(id);
			}
			DBManager.closeConnection(conn,stmt);
			return SUCCESS;
		} catch(SQLException e) {
			e.printStackTrace();
			System.out.println(e.getErrorCode() + " " + e.getMessage());
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
	public Set<InfluenceGraph> getInfluenceGraphSet(){
		Set<InfluenceGraph> influencegraph = new TreeSet<>();
		conn = DBManager.getConnection();
		String sql = "select id, name from influencegraph";
		try{
			stmt = conn.createStatement();
			rs = stmt.executeQuery(sql);
			while(rs.next()) {
				int id = rs.getInt(1);
				String name = rs.getString(2);
				InfluenceGraph temp_influencegraph = new InfluenceGraph(name);
				temp_influencegraph.setId(id);
				influencegraph.add(temp_influencegraph);
			}
			return influencegraph;
		}catch(SQLException e) {
			e.printStackTrace();
			System.out.println(e.getErrorCode() +" " + e.getMessage());
			DBManager.closeConnection(conn, stmt);
			return null;
		}
	}
	public InfluenceGraph getInfluenceGraph(int graph_id) {
		conn = DBManager.getConnection();
		String sql = "SELECT id, name FROM influencegraph WHERE id="+graph_id;
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
	public void deleteInfluenceGraph(InfluenceGraph ig) {
		
		conn = DBManager.getConnection();
		String sql = "DELETE FROM influencegraph WHERE id=" + ig.getId();
		
		try{
			stmt = conn.createStatement();
			stmt.executeUpdate(sql);
		} catch(SQLException e) {
			e.printStackTrace();
		}
		DBManager.closeConnection(conn,stmt);
	}
}
