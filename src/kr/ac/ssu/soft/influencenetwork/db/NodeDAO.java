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

	public int saveNode(Node node, int graphId) {
//		String sql = "insert into node(name, graph_id, type_id) values(?,?,"+"(select id from nodetype where name=\""+ node.getNt().getName() +"\"" +"))";
		int id = 0;
		String sql = "insert into node(domain_id, name, graph_id, type_id, x, y) " +
				"values(?, ?, ?, (select id from nodetype where name=?), ?, ?)";
		conn = DBManager.getConnection();
		
		try{
			pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
			pstmt.setString(1, node.getDomainId());
			pstmt.setString(2, node.getName());
			pstmt.setInt(3, graphId);
			pstmt.setString(4, node.getNodeType().getName());
			pstmt.setFloat(5,node.getX());
			pstmt.setFloat(6,node.getY());
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

	public int saveNode(String domainId, String name, int typeId, float x, float y, int graphId) {
//		String sql = "insert into node(name, graph_id, type_id) values(?,?,"+"(select id from nodetype where name=\""+ node.getNt().getName() +"\"" +"))";
		int id = 0;
		String sql = "insert into node(domain_id, name, graph_id, type_id, x, y) " +
				"values(?, ?, ?, ?, ?, ?)";
		conn = DBManager.getConnection();

		try{
			pstmt = conn.prepareStatement(sql);
			if(domainId == null)
				pstmt.setNull(1, Types.VARCHAR);
			else
				pstmt.setString(1, domainId);
			if(name == null)
				pstmt.setNull(2, Types.VARCHAR);
			else
				pstmt.setString(2, name);
			pstmt.setInt(3, graphId);
			pstmt.setInt(4, typeId);
			pstmt.setFloat(5, x);
			pstmt.setFloat(6, y);
			pstmt.executeUpdate();
			rs = pstmt.getGeneratedKeys();
			DBManager.closeConnection(conn,pstmt);
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

	public Set<Node> getNodeSet(int graphId, Set<NodeType> nodeTypeSet) { //need to revise whole code.
		conn = DBManager.getConnection();
		Set<Node> NodeSet = new TreeSet<>();
		String sql = "SELECT id, domain_id, name, type_id, x, y FROM node WHERE graph_id="+graphId;
		try {
			stmt = conn.createStatement();
			ResultSet rs = stmt.executeQuery(sql);
			while (rs.next()) {
				int nodeId = rs.getInt(1);
				String domainId = rs.getString(2);
				String nodeName = rs.getString(3);
				int nodeTypeId = rs.getInt(4);
				float x = rs.getFloat(5);
				float y = rs.getFloat(6);
				NodeType nodetype = null;
				for (NodeType nt : nodeTypeSet) {
					if (nodeTypeId == nt.getId()) {
						nodetype = nt;
						break;
					}
				}
				Node node = new Node(domainId, nodetype, nodeName, x, y);
				node.setId(nodeId);
				
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

	public boolean updateNode(Node node) {
		conn = DBManager.getConnection();
		String sql = "UPDATE node SET domain_id = ?, name = ?, type_id = ?, x = ?, y = ? WHERE id = ?";

		try {
			pstmt = conn.prepareStatement(sql);
			pstmt.setString(1, node.getDomainId());
			pstmt.setString(2, node.getName());
			pstmt.setInt(3, node.getNodeType().getId());
			pstmt.setFloat(4, node.getY());
			pstmt.setFloat(5, node.getX());
			pstmt.setInt(6, node.getId());
			DBManager.closeConnection(conn, pstmt);
			return true;
		} catch(SQLException e) {
			e.printStackTrace();
			System.out.println(e.getErrorCode() +" " + e.getMessage());
			DBManager.closeConnection(conn, pstmt);
			return false;
		}
	}

	public boolean deleteNode(int nodeId) {
		conn = DBManager.getConnection();
		String sql = "DELETE FROM node where id=?";
		
		try {
			pstmt = conn.prepareStatement(sql);
			pstmt.setInt(1, nodeId);
			pstmt.executeUpdate();
			DBManager.closeConnection(conn, pstmt);
			return true;
		} catch (SQLException e) {
			e.printStackTrace();
			System.out.println(e.getErrorCode() +" " + e.getMessage());
			DBManager.closeConnection(conn, pstmt);
			return false;
		}	
	}
}
