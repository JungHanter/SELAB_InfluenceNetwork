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

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;

import static java.lang.System.out;

@WebServlet(description = "Login, Logout", urlPatterns = { "/session" })
public class SessionServlet extends HttpServlet {
    private User user;

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {


        String num1 = request.getParameter("num1");
        String num2 = request.getParameter("num2");
        response.setContentType("application/json; charset=UTF-8");
//        response.setContentType("text/plain; charset=UTF-8");
        PrintWriter out = response.getWriter();
        int result = Integer.parseInt(num1) + Integer.parseInt(num2);
        String jsonString = "{result: " + result + "}";
        System.out.print(jsonString);
        out.print(jsonString);

//        JSONObject jsonObject = new JSONObject();
//        out.print(result);

    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

//        BufferedReader br = new BufferedReader(new InputStreamReader(request.getInputStream()));
//        String json = "";
//        if(br != null){
//            json = br.readLine();
//        }
//
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

}
