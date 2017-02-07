package kr.ac.ssu.soft.influencenetwork.restapi;

//import com.fasterxml.jackson.databind.JsonMappingException;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import kr.ac.ssu.soft.influencenetwork.User;
//
//import javax.servlet.ServletException;
//import javax.servlet.annotation.WebServlet;
//import javax.servlet.http.HttpServlet;
//import javax.servlet.http.HttpServletRequest;
//import javax.servlet.http.HttpServletResponse;
//import java.io.BufferedReader;
//import java.io.IOException;
//import java.io.InputStreamReader;



import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.util.JSONPObject;
import jdk.nashorn.api.scripting.JSObject;

import kr.ac.ssu.soft.influencenetwork.User;
import kr.ac.ssu.soft.influencenetwork.db.DBManager;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.sql.*;

import static java.lang.System.out;

@WebServlet(description = "Login, Logout", urlPatterns = { "/session" })
public class SessionServlet extends HttpServlet {

    private User user;

    private Connection conn = null;
    private PreparedStatement pstmt = null;
    private Statement stmt = null;
    private ResultSet resultSet = null;

    public static int SUCCESS = 0;
    public static int ERROR_CONNECTION = 1;
    public static int ERROR_DUPLICATION = 2;
    public static int ERROR_UNKNOWN = 9;
    public static int UNVALID_VALUE = 10;

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {


        String num1 = request.getParameter("num1");
        String num2 = request.getParameter("num2");

//        response.setContentType("text/plain; charset=UTF-8");
        PrintWriter out = response.getWriter();
//        int result = Integer.parseInt(num1) + Integer.parseInt(num2);
//        String jsonString = "{ \"result\" : " + result + "}";
//        System.out.print(jsonString);
//        out.print(jsonString);
//        response.setContentType("application/json; charset=UTF-8");
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("result", 1234);
        String result = jsonObject.toJSONString();
        System.out.println(result);
        out.write(result);

    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        BufferedReader br = new BufferedReader(new InputStreamReader(request.getInputStream()));
        String json = "";
        if(br != null){
            json = br.readLine();
        }
        System.out.println(json);
        PrintWriter out = response.getWriter();
//        out.print(json);

        JSONParser parser = new JSONParser();
        JSONObject jsonObject = null;
        try {
            jsonObject = (JSONObject) parser.parse(json);
        } catch (ParseException e) {
            e.printStackTrace();
        }

        int num1 = Integer.parseInt(jsonObject.get("num1").toString());
        int num2 = Integer.parseInt(jsonObject.get("num2").toString());
        int result = num1 + num2;
        System.out.println(num1 + num2);
        out.print(result);


//        //2. initiate jackson mapper
//        ObjectMapper mapper = new ObjectMapper();
//
//        //3. Convert received JSON to Article
//        try {
//            user = mapper.readValue(json, User.class);
//        } catch (JsonMappingException e) {
//            e.printStackTrace();
//        }
//
//        //4. Set response type to JSON
//        response.setContentType("application/json");
//
//        // 6. Send List<Article> as JSON to client
//        mapper.writeValue(response.getOutputStream(), user);
    }

    public JSONObject login(String email, String pw) {
        conn = DBManager.getConnection();
        String sql = "SELECT email, pw, name FROM user WHERE email=? AND pw=?";
        JSONObject result = new JSONObject();


        try {
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, email);
            pstmt.setString(2, pw);
            resultSet = pstmt.executeQuery();
            if (resultSet != null && resultSet.next()) {
               String savedEmail = resultSet.getString(1);
               String savedPw = resultSet.getString(2);
               String savedName = resultSet.getString(3);

               /* Success Login */
               if (email.equals(savedEmail) && pw.equals(savedPw)) {
                   JSONObject user = new JSONObject();
                   user.put("email", savedEmail);
                   user.put("name", savedName);
                   result.put("user", user);

               }
            }
        } catch (SQLException e) {

        }


    }

}
