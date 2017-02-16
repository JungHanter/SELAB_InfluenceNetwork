package kr.ac.ssu.soft.influencenetwork.db;

import java.sql.*;
import java.util.*;

public class DBManager {

	public static Connection getConnection() {
		Connection conn = null;
		PreparedStatement pstmt = null;
		
		String jdbcDriver = "com.mysql.jdbc.Driver";
		String jdbcUrl = "jdbc:mysql://203.253.23.18:3306/influencegraph";
		String jdbcId = "root";
		String jdbcPw = "1001";
		
		try{
			Class.forName(jdbcDriver);
			conn = DriverManager.getConnection(jdbcUrl, jdbcId, jdbcPw);
		} catch (Exception e){
		e.printStackTrace();
		return null;
		}
		return conn;
	}
	public static boolean closeConnection(Connection conn, Statement stmt) {
		try{
			conn.close();
			stmt.close();
			return true;
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return false;
		}
	}
}
