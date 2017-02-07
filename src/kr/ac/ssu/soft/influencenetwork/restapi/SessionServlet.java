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


import kr.ac.ssu.soft.influencenetwork.User;
import kr.ac.ssu.soft.influencenetwork.db.UserDAO;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;

@WebServlet(description = "Login, Logout", urlPatterns = { "/session" })
public class SessionServlet extends HttpServlet {

    private User user;
    private UserDAO userDAO = new UserDAO();

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {


//        String num1 = request.getParameter("num1");
//        String num2 = request.getParameter("num2");

//        response.setContentType("text/plain; charset=UTF-8");
//        PrintWriter out = response.getWriter();
//        int result = Integer.parseInt(num1) + Integer.parseInt(num2);
//        String jsonString = "{ \"result\" : " + result + "}";
//        System.out.print(jsonString);
//        out.print(jsonString);
//        response.setContentType("application/json; charset=UTF-8");
//        JSONObject jsonObject = new JSONObject();
//        jsonObject.put("result", 1234);
//        String result = jsonObject.toJSONString();
//        System.out.println(result);
//        out.write(result);

        JSONObject jsonObject = getSession(request);
        PrintWriter out = response.getWriter();
        out.write(jsonObject.toJSONString());
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
        JSONObject result = null;

        try {
            jsonObject = (JSONObject) parser.parse(json);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        String action = jsonObject.get("action").toString();
        if(action.equals("login")) {
            String email = jsonObject.get("email").toString();
            String pw = jsonObject.get("pw").toString();
            result = login(email, pw, request);
        }
        else if(action.equals("logout")) {
            result = logout(request);
        }

        out.write(result.toJSONString());
        out.close();

//        int num1 = Integer.parseInt(jsonObject.get("num1").toString());
//        int num2 = Integer.parseInt(jsonObject.get("num2").toString());
//        int result = num1 + num2;
//        System.out.println(num1 + num2);
//        out.print(result);


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

    public JSONObject login(String email, String pw, HttpServletRequest request) {
        JSONObject result = new JSONObject();
        user = userDAO.getUser(email, pw);

        if (user != null) {
            JSONObject userJson = new JSONObject();
            userJson.put("email", user.getEmail());
            userJson.put("name", user.getName());
            result.put("user", userJson);
            result.put("result", "success");

            HttpSession session = request.getSession();
            session.setAttribute("user", user);
        }
        else {
            result.put("result", "fail");
            result.put("message", "wrong id or pw");
        }
        return result;
    }
    public JSONObject logout(HttpServletRequest request) {
        JSONObject result = new JSONObject();
        if(request.getSession(false) != null) {
        HttpSession session = request.getSession();
        session.invalidate();
        result.put("result", "success");
        }
        else {
            result.put("result", "fail");
        }
        return result;
    }
    public JSONObject getSession(HttpServletRequest request) {
        JSONObject resultJson = new JSONObject();
        if(request.getSession(false) != null) {
            User user = (User)request.getSession().getAttribute("user");
            JSONObject userJson = new JSONObject();
            userJson.put("email", user.getEmail());
            userJson.put("name", user.getName());
            resultJson.put("result", "success");
            resultJson.put("user", userJson);
        }
        else {
            resultJson.put("result", "fail");
        }
        return resultJson;
    }
}
