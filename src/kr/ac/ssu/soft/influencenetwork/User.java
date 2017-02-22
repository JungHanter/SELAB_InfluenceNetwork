package kr.ac.ssu.soft.influencenetwork;

public class User {

    private String email;
    private String name;
    private String pw;
    private int verified = 0;
    private String hash;


    public User (String email, String pw) {
        this.email = email;
        this.pw = pw;
    }
    public User (String email, String pw, String name) {
        this.email = email;
        this.pw = pw;
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPw() {
        return pw;
    }

    public void setPw(String pw) {
        this.pw = pw;
    }

    public int getVerified() {
        return verified;
    }

    public void setVerified(int verified) {
        this.verified = verified;
    }

    public String getHash() {
        return hash;
    }

    public void setHash(String hash) {
        this.hash = hash;
    }

}
