package kr.ac.ssu.soft.influencenetwork.db;

import kr.ac.ssu.soft.influencenetwork.Node;
import kr.ac.ssu.soft.influencenetwork.NodeType;

import java.sql.*;
import java.util.*;

public class NodeDAO {
	public static int SUCCESS = 0;
	public static int ERROR_CONNECTION = 1;
	public static int ERROR_DUPLICATION = 2;
	public static int ERROR_UNKNOWN = 9;

	private Connection conn = null;
	private PreparedStatement pstmt = null;
	private Statement stmt = null;
	private ResultSet rs = null;

	public int saveNode(Node node, int graph_id) {
//		String sql = "insert into node(name, graph_id, type_id) values(?,?,"+"(select id from nodetype where name=\""+ node.getNt().getName() +"\"" +"))";
		int id = 0;
		String sql = "insert into node(name, graph_id, type_id) " +
				"values(?,?,(select id from nodetype where name=?))";
		conn = DBManager.getConnection();
		
		try{
			pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
			pstmt.setString(1, node.getName());
			pstmt.setInt(2, graph_id);
			pstmt.setString(3, node.getNodeType().getName());
			pstmt.executeUpdate();
			rs = pstmt.getGeneratedKeys();
			if (rs != null & rs.next()) {
				id = rs.getInt(1);
				node.setId(id);
				DBManager.closeConnection(conn,pstmt);
			}
			return SUCCESS;
		} catch(SQLException e) {
			e.printStackTrace();
			DBManager.closeConnection(conn,pstmt);
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
	public Set<Node> getNodeSet(int graph_id, Set<NodeType> nodeTypeSet) { //need to revise whole code.
		conn = DBManager.getConnection();
		Set<Node> NodeSet = new TreeSet<>();
		String sql = "SELECT id, name, type_id FROM node WHERE graph_id="+graph_id;
		try {
			stmt = conn.createStatement();
			ResultSet rs = stmt.executeQuery(sql);
			while (rs.next()) {
				int node_id = rs.getInt(1);
				String node_name = rs.getString(2);
				int node_type_id = rs.getInt(3);
				NodeType nodetype = null;
				for(NodeType nt : nodeTypeSet) {
					if (node_type_id==nt.getId()) {
						nodetype = nt;
						break;
					}
				}
				Node node = new Node(node_id, nodetype, node_name);
				
				NodeSet.add(node);
			}
			DBManager.closeConnection(conn,stmt);
			return NodeSet;
		} catch(SQLException e) {
			e.printStackTrace();
			System.out.println(e.getErrorCode() +" " + e.getMessage());
		}
		DBManager.closeConnection(conn,stmt);
		return null;
	}

	public int updateNode(int nodeId, String name, NodeType nt) {
		conn = DBManager.getConnection();
		String sql_name = "UPDATE node SET name=? WHERE id=?";
		String sql_nodetype = "UPDATE node SET type_id=? WHERE id=?";

		try {
			if (name != null) {
				pstmt = conn.prepareStatement(sql_name);
				pstmt.setString(1, name);
				pstmt.setInt(2, nodeId);
				pstmt.executeUpdate();
			}
			if (nt != null) {
				pstmt = conn.prepareStatement(sql_nodetype);
				pstmt.setInt(1, nt.getId());
				pstmt.setInt(2, nodeId);
				pstmt.executeUpdate();
			}
			DBManager.closeConnection(conn, pstmt);
			return SUCCESS;
		} catch(SQLException e) {
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
	public int deleteNode(int nodeId) {
		conn = DBManager.getConnection();
		String sql = "DELETE FROM node where id=?";
		
		try {
			pstmt = conn.prepareStatement(sql);
			pstmt.setInt(1, nodeId);
			pstmt.executeUpdate();
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
}
