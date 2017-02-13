package kr.ac.ssu.soft.influencenetwork.db;

import kr.ac.ssu.soft.influencenetwork.EdgeType;
import kr.ac.ssu.soft.influencenetwork.NodeType;

import java.sql.*;
import java.util.Set;
import java.util.TreeSet;

/**
 * Created by SEL on 2017-02-13.
 */
public class EdgeTypeDAO {

    public static int SUCCESS = 0;
    public static int ERROR_CONNECTION = 1;
    public static int ERROR_DUPLICATION = 2;
    public static int ERROR_UNKNOWN = 9;

    private Connection conn = null;
    private PreparedStatement pstmt = null;
    private Statement stmt = null;
    private ResultSet rs = null;

    public int saveEdgeType(EdgeType edgeType, int graph_id) {

        conn = DBManager.getConnection();

        String sql = "insert into edgetype(name, color, graph_id) " +
                "values(?,?,?)";

        try {
            pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            pstmt.setString(1, edgeType.getName());
            pstmt.setString(2, edgeType.getColor());
            pstmt.setInt(3, graph_id);
            pstmt.executeUpdate();
            rs = pstmt.getGeneratedKeys();
            if (rs != null & rs.next()) {
                int id = rs.getInt(1);
                DBManager.closeConnection(conn,pstmt);
                edgeType.setId(id);
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

    public Set<EdgeType> getEdgeTypeSet(int graphId) {

        conn = DBManager.getConnection();

        Set<EdgeType> edgeTypeSet = new TreeSet<>();
        String sql = "select id, name, color from edgetype where edgetype.graph_id=" + graphId;

        try {
            stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery(sql);
            while (rs.next()) {
                int id = rs.getInt(1);
                String edgetypeName = rs.getString(2);
                String edgetypeColor = rs.getString(3);
                EdgeType edgeType = new EdgeType(edgetypeColor, edgetypeName);
                edgeType.setId(id);
                edgeTypeSet.add(edgeType);
            }
            DBManager.closeConnection(conn, stmt);
            return edgeTypeSet;
        } catch (SQLException e) {
            e.printStackTrace();
            DBManager.closeConnection(conn, stmt);
            return null;
        }
    }

    public boolean updateEdgeType(EdgeType edgeType) {
        conn = DBManager.getConnection();
        String sql = "UPDATE edgetype SET name = ?, color = ? WHERE id = ?";

        try {
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, edgeType.getName());
            pstmt.setString(2, edgeType.getColor());
            pstmt.setInt(3, edgeType.getId());
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

    public boolean deleteEdgeType(int edgeTypeId) {
        String sql = "DELETE FROM edgetype where id=?";

        conn = DBManager.getConnection();

        try {
            pstmt = conn.prepareStatement(sql);
            pstmt.setInt(1, edgeTypeId);
            pstmt.executeUpdate();
            DBManager.closeConnection(conn,pstmt);
            return true;
        } catch (SQLException e) {
            e.printStackTrace();
            DBManager.closeConnection(conn, pstmt);
            System.out.println(e.getErrorCode() + " " + e.getMessage());
            return false;
        }
    }
}
