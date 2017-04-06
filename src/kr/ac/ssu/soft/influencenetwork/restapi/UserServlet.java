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

import kr.ac.ssu.soft.influencenetwork.HashGenerationException;
import kr.ac.ssu.soft.influencenetwork.HashGenerator;
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
import java.util.Properties;
import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

@WebServlet(description = "signup", urlPatterns = { "/user" })
public class UserServlet extends HttpServlet {

    private UserDAO userDAO = new UserDAO();

    protected void doGet(HttpServletRequest request, HttpServletResponse response) {

        /* Activate account */
        PrintWriter out = null;
        try {
            out = response.getWriter();
        } catch (IOException e) {
            e.printStackTrace();
        }

        String email = request.getParameter("email");
        String hash = request.getParameter("hash");
        JSONObject result = new JSONObject();

        if (userDAO.isVerifiedUser(email) == false) {
            userDAO.activateUser(email, hash);
            result.put("result", "success");
        } else {
            result.put("result", "fail");
            result.put("message", "Already your account is activated.");
        }
        out.write(result.toJSONString());
        out.close();
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

        if(action.equals("signup")) {
            String email = jsonObject.get("email").toString();
            String password = jsonObject.get("password").toString();
            String name = jsonObject.get("user_name").toString();
            result = signup(email, password, name);
        } else {
            result.put("result", "fail");
            result.put("message", "api form is wrong");
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
            result.put("message", "wrong email form");
            return result;
        }
        try {
            String hash = HashGenerator.generateMD5(email);
            User user = new User(email, password, name);
            user.setHash(hash);
            if(userDAO.saveUser(user) == 0) {
                JSONObject userJson = new JSONObject();

//                final String senderEmail = "selab.ssu@gmail.com";
//                final String senderPassword = "lovejesus7";

                final String senderEmail = "influencenet.net@gmail.com";
                final String senderPassword = "slab0909";

                Properties props = new Properties();
                props.put("mail.smtp.auth", "true");
                props.put("mail.smtp.starttls.enable", "true");
                props.put("mail.smtp.host", "smtp.gmail.com");
                props.put("mail.smtp.ssl.trust", "smtp.gmail.com");
                props.put("mail.smtp.port", "587");


                Session session = Session.getInstance(props,
                        new javax.mail.Authenticator() {
                            protected PasswordAuthentication getPasswordAuthentication() {
                                return new PasswordAuthentication(senderEmail, senderPassword);
                            }
                        });
                session.setDebug(true);
                try {
                    Message message = new MimeMessage(session);
                    message.setFrom(new InternetAddress(senderEmail));
                    message.setRecipients(
                            Message.RecipientType.TO,
                            InternetAddress.parse(email)
                    );
                    message.setSubject("Welcome to Influence network");
                    String content = "Thanks for signing up!<br>" +
                            "Your account has been created, you can login after activating your account by entering the link below.<br>" +
                            "Please Copy below link and paste to address field of web browser.<br><br>" +
                            "<strong>influencenet.net/email_verification.jsp?email="+email+"&hash="+hash+"</strong>";
                    content = content.replace(".","<span>.</span>");
                    System.out.println("test : " + content);
//                    message.setContent("Thanks for signing up!<br>" +
//                                    "Your account has been created, you can login after activating your account by pressing the link below.<br>" +
//                                    "<strong>influencenet.&#8203;net/email_verification.&#8203;jsp?email="+email+"&hash="+hash+"</strong>",
//                            "text/html; charset=utf-8");
                    message.setContent(content, "text/html; charset=utf-8");
                    Transport.send(message);
                    System.out.println("Done");
                } catch (MessagingException e) {
                    throw new RuntimeException(e);
                }
                result.put("result", "success");
            } else {
                result.put("result", "fail");
                result.put("message", "This email has already been registered.");
            }
        } catch (HashGenerationException e) {
            e.printStackTrace();
        }
        return result;
    }
}
