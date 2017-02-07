package kr.ac.ssu.soft.influencenetwork.db;

import kr.ac.ssu.soft.influencenetwork.NodeType;

import java.sql.*;
import java.util.*;

public class NodeTypeDAO {
	public static int SUCCESS = 0;
	public static int ERROR_CONNECTION = 1;
	public static int ERROR_DUPLICATION = 2;
	public static int ERROR_UNKNOWN = 9;

	private Connection conn = null;
	private PreparedStatement pstmt = null;
	private Statement stmt = null;
	private ResultSet rs = null;

	public int saveNodeType(NodeType nt, int graph_id) {

		conn = DBManager.getConnection();

		String sql = "insert into nodetype(name, color, graph_id) " +
				"values(?,?,?)";
		
		try {
			pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
			pstmt.setString(1, nt.getName());
			pstmt.setString(2, nt.getColor());
			pstmt.setInt(3, graph_id);
			pstmt.executeUpdate();
			rs = pstmt.getGeneratedKeys();
			if (rs != null & rs.next()) {
				int id = rs.getInt(1);
				DBManager.closeConnection(conn,pstmt);
				nt.setId(id);
			}
			return SUCCESS;
		} catch(SQLException e) {
			e.printStackTrace();
			DBManager.closeConnection(conn,pstmt);
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

	public Set<NodeType> getNodeTypeSet(int graph_id) {

		conn = DBManager.getConnection();

		Set<NodeType> NodeTypeSet = new TreeSet<>();
		String sql = "select id, name, color from nodetype where nodetype.graph_id=" + graph_id;
		
		try {
			stmt = conn.createStatement();
			ResultSet rs = stmt.executeQuery(sql);
			while (rs.next()) {
				int id = rs.getInt(1);
				String nodetype_name = rs.getString(2);
				String nodetype_color = rs.getString(3);
				NodeType nodetype = new NodeType(id, nodetype_color, nodetype_name);
				NodeTypeSet.add(nodetype);
			}
			DBManager.closeConnection(conn, stmt);
			return NodeTypeSet;
		} catch (SQLException e) {
			e.printStackTrace();
			DBManager.closeConnection(conn, stmt);
			return null;
		}
	}

	public int updateNodeType(int nodeTypeId, String name, String color) {
		conn = DBManager.getConnection();
		String sql_name = "UPDATE nodetype SET name=? Where id=?";
		String sql_color = "UPDATE nodetype SET color=? Where id=?";

		try {
			if (name != null) {
				pstmt = conn.prepareStatement(sql_name);
				pstmt.setString(1, name);
				pstmt.setInt(2, nodeTypeId);
				pstmt.executeUpdate();
			}
			if (color != null) {
				pstmt = conn.prepareStatement(sql_color);
				pstmt.setString(1, color);
				pstmt.setInt(2, nodeTypeId);
				pstmt.executeUpdate();
			}
			DBManager.closeConnection(conn, pstmt);
			return SUCCESS;
		} catch (SQLException e) {
			e.printStackTrace();
			System.out.println(e.getErrorCode() +" " + e.getMessage());
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
	public int deleteNodeType(int nodeTypeId) {
		String sql = "DELETE FROM nodetype where id=?";
		
		conn = DBManager.getConnection();
		
		try {
			pstmt = conn.prepareStatement(sql);
			pstmt.setInt(1, nodeTypeId);
			pstmt.executeUpdate();
			DBManager.closeConnection(conn,pstmt);
			return SUCCESS;
		} catch (SQLException e) {
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
}
