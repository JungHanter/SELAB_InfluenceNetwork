<%--
  Created by IntelliJ IDEA.
  User: SEL
  Date: 2017-02-22
  Time: 10:48 AM
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Email Verification</title>
    <link rel="stylesheet" type="text/css" href="lib/bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="css/bootstrap-custom.css">
    <link rel="stylesheet" type="text/css" href="css/style.css">
</head>
<body>

<div id="alertModal" class="modal fade" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 id="alertModalTitle" class="modal-title">Alert</h4>
            </div>
            <div class="modal-body">
                <p id="alertModalMsg">message</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-dark" data-dismiss="modal">OK</button>
            </div>
        </div>
    </div>
</div>

</body>
</html>
<script src="lib/jquery/jquery-3.1.1.min.js"></script>
<script src="js/jquery.cookie.js"></script>
<script src="js/jquery_extends.js"></script>
<script src="lib/bootstrap/js/bootstrap.min.js"></script>
<script>
    var email = "<%= request.getParameter("email") %>";
    var hash = "<%= request.getParameter("hash") %>";
    $.ajax("/user", {
        method: 'get',
        dataType: 'json',
        data: {
            email : email,
            hash : hash
        },
        success: function (res) {
            console.log(res);
            if (res.result == "success") {
                openAlertModal('Your account is activated.', 'Email Verification Success.');
            } else {
                openAlertModal('Already your account is activated.', 'Email Verification Fail.');
            }
        }, error: function (xhr, status, error) {
            console.log(xhr);
            openAlertModal(xhr.statusText, 'Email Verification is fail.');
        }
    });

    function openAlertModal(msg, title) {
        if (title == undefined || title == null || !/\S/.test(title)) {
            title = "Alert";
        }
        $('#alertModalTitle').text(title);
        $('#alertModalMsg').text(msg);
        $('#alertModal').modal();
        
        $('button').click(function () {
            location.href='http://influencenet.net';
        });
        $(this).click(function () {
            location.href='http://influencenet.net';
        });
    }
</script>
