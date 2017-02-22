package kr.ac.ssu.soft.influencenetwork.db;

import kr.ac.ssu.soft.influencenetwork.User;
import java.sql.*;

public class UserDAO {
    private Connection conn = null;
    private PreparedStatement pstmt = null;
    private ResultSet rs = null;

    public static int SUCCESS = 0;
    public static int ERROR_CONNECTION = 1;
    public static int ERROR_DUPLICATION = 2;
    public static int ERROR_UNKNOWN = 9;
    public static int UNVALID_VALUE = 10;

    public int saveUser (User user) {
        String sql = "insert into user(email, pw, name, hash) " +
                "values(?,?,?,?)";
        conn = DBManager.getConnection();

        try{
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, user.getEmail());
            pstmt.setString(2, user.getPw());
            pstmt.setString(3, user.getName());
            pstmt.setString(4, user.getHash());

            pstmt.executeUpdate();

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

    public User getUser(String email, String pw) {
        conn = DBManager.getConnection();
        String sql = "SELECT email, pw, name, verified FROM user WHERE email=? and pw=?";
        ResultSet rs = null;
        try {
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, email);
            pstmt.setString(2, pw);
            rs = pstmt.executeQuery();
            if (rs != null && rs.next()) {
                String savedName = null, savedEmail = null, savedPw = null;
                int savedVerified = 0;
                savedEmail = rs.getString(1);
                savedPw = rs.getString(2);
                savedName = rs.getString(3);
                savedVerified = rs.getInt(4);
                User user = new User(savedEmail, savedPw, savedName);
                user.setVerified(savedVerified);
                DBManager.closeConnection(conn,pstmt);
                return user;
            }
        } catch (SQLException e) {
            e.printStackTrace();
            DBManager.closeConnection(conn,pstmt);
            System.out.println(e.getErrorCode() +" " + e.getMessage());
        }
        return null;
    }

    public boolean activateUser(String email, String hash) {
        conn = DBManager.getConnection();
        String sql = "UPDATE user SET verified = 1 WHERE email = ? AND hash = ?";
        try {
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, email);
            pstmt.setString(2, hash);
            pstmt.executeUpdate();
            pstmt.close();
            return true;
        } catch (SQLException e) {
            e.printStackTrace();
            System.out.println(e.getErrorCode() +" " + e.getMessage());
        }
        DBManager.closeConnection(conn, pstmt);
        return false;
    }

//    public int updateUser(String email, String pw, String newPw, String name) {
//        conn = DBManager.getConnection();
//        String sqlPw = "UPDATE user SET pw=? WHERE id=? and pw=?";
//        String sqlName = "UPDATE user SET name=? WHERE id=? and pw=?";
//        String sqlEmail = "UPDATE user SET email=? WHERE id=? and pw=?";
//
//        try {
//            if (newPw != null) {
//                pstmt = conn.prepareStatement(sqlPw);
//                pstmt.setString(1, newPw);
//                pstmt.setString(2, id);
//                pstmt.setString(3, pw);
//                pstmt.executeUpdate();
//            }
//            if (name != null) {
//                pstmt = conn.prepareStatement(sqlName);
//                pstmt.setString(1, name);
//                pstmt.setString(2, id);
//                pstmt.setString(3, pw);
//                pstmt.executeUpdate();
//            }
//            if (email != null) {
//                pstmt = conn.prepareStatement(sqlEmail);
//                pstmt.setString(1, email);
//                pstmt.setString(2, id);
//                pstmt.setString(3, pw);
//                pstmt.executeUpdate();
//            }
//            DBManager.closeConnection(conn, pstmt);
//            return SUCCESS;
//        } catch(SQLException e) {
//            e.printStackTrace();
//            System.out.println(e.getErrorCode() +" " + e.getMessage());
//            DBManager.closeConnection(conn, pstmt);
//            switch (e.getErrorCode()) {
//                case 1129 :
//                    return ERROR_CONNECTION;
//                case 1169 :
//                    return ERROR_DUPLICATION;
//                default:
//                    return ERROR_UNKNOWN;
//            }
//        }
//    }
//
//    public int deleteUser(String id, String pw) {
//        conn = DBManager.getConnection();
//        String sql = "DELETE FROM user where id=? and pw=?";
//
//        try {
//            pstmt = conn.prepareStatement(sql);
//            pstmt.setString(1, id);
//            pstmt.setString(2, pw);
//            pstmt.executeUpdate();
//            DBManager.closeConnection(conn, pstmt);
//            return SUCCESS;
//        } catch (SQLException e) {
//            e.printStackTrace();
//            System.out.println(e.getErrorCode() +" " + e.getMessage());
//            DBManager.closeConnection(conn, pstmt);
//            switch (e.getErrorCode()) {
//                case 1129 :
//                    return ERROR_CONNECTION;
//                case 1169 :
//                    return ERROR_DUPLICATION;
//                default:
//                    return ERROR_UNKNOWN;
//            }
//        }
//    }
}
