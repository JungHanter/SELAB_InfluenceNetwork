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

@WebServlet(description = "login/logout/getSession", urlPatterns = { "/session" })
public class SessionServlet extends HttpServlet {

    private User user;
    private UserDAO userDAO = new UserDAO();

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        JSONObject jsonObject = getSession(request);
        PrintWriter out = response.getWriter();
        out.write(jsonObject.toJSONString());
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(request.getInputStream()));
        String json = "";

        if (br != null) {
            json = br.readLine();
        }
        System.out.println(json);
        PrintWriter out = response.getWriter();

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
            String pw = jsonObject.get("password").toString();
            result = login(email, pw, request);
        }
        else if(action.equals("logout")) {
            result = logout(request);
        }

        out.write(result.toJSONString());
        out.close();
    }

    public JSONObject login(String email, String pw, HttpServletRequest request) {
        JSONObject result = new JSONObject();
        user = userDAO.getUser(email, pw);

        if (user != null) {
            JSONObject userJson = new JSONObject();
            userJson.put("email", user.getEmail());
            userJson.put("user_name", user.getName());
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
        User user = (User)request.getSession().getAttribute("user");

        if (user != null) {
        HttpSession session = request.getSession();
        session.invalidate();
        result.put("result", "success");
        }
        else {
            result.put("result", "fail");
            result.put("message", "Already logout");
        }
        return result;
    }

    public static JSONObject getSession(HttpServletRequest request) {
        JSONObject resultJson = new JSONObject();
        User user = (User)request.getSession().getAttribute("user");

        if(user != null) {
            JSONObject userJson = new JSONObject();
            userJson.put("email", user.getEmail());
            userJson.put("user_name", user.getName());
            resultJson.put("result", "success");
            resultJson.put("user", userJson);
        }
        else {
            resultJson.put("result", "fail");
            resultJson.put("meassage", "Session is none");
        }
        return resultJson;
    }

    public JSONObject signup(String email, String password, String name) {
        User user = new User(email, password, name);
        JSONObject result = new JSONObject();

        if(userDAO.saveUser(user) == 0) {
            JSONObject userJson = new JSONObject();
            userJson.put("email", user.getEmail());
            userJson.put("user_name", user.getName());
            result.put("user", userJson);
            result.put("result", "success");
        } else {
            result.put("result", "fail");
            result.put("meassage", "duplicated email");
        }
        return result;
    }
}
