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
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@WebServlet(description = "signup", urlPatterns = { "/user" })
public class UserServlet extends HttpServlet {

    private UserDAO userDAO = new UserDAO();

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

        if(action.equals("signup")) {
            String email = jsonObject.get("email").toString();
            String password = jsonObject.get("password").toString();
            String name = jsonObject.get("user_name").toString();
            result = signup(email, password, name);
        } else {
            result.put("result", "fail");
            result.put("meassage", "api form is wrong");
        }

        out.write(result.toJSONString());
        out.close();
    }

    public JSONObject signup(String email, String password, String name) {
        JSONObject result = new JSONObject();

        String regexEmail = "^[A-Za-z0-9+_.-]+@(.+)$";
        Pattern pattern = Pattern.compile(regexEmail);
        Matcher matcher = pattern.matcher(email);
        if (matcher.matches() == false) {
            result.put("result", "fail");
            result.put("meassage", "wrong email form");
            return result;
        }

        User user = new User(email, password, name);
        if(userDAO.saveUser(user) == 0) {
            JSONObject userJson = new JSONObject();
            result.put("result", "success");
        } else {
            result.put("result", "fail");
            result.put("meassage", "duplicated email");
        }
        return result;
    }
}
