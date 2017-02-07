<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="en">
<head>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
  <meta charset="UTF-8">
  <title>Get/Post Test</title>
</head>
<body>
<input type="text" id="num1">
<input type="text" id="num2">
<button id="btn_get">GET</button>
<button id="btn_post">POST</button>
</body>
</html>

<script>
    var num_set = {};

    $("#btn_get").click(function () {
        num_set.num1 = $('#num1').val();
        num_set.num2 = $('#num2').val();

        $.ajax({
            url: "/session",
            type: 'get',
            dataType: 'json',
            data: { 'num1' : num_set.num1, 'num2' : num_set.num2},
//           data: JSON.stringify(num_set),
//           contentType: 'application/json',
//           mimeType: 'application/json',
            success: function (data) {
                console.log(data);
            }, error: function(xhr,status,error) {
                console.log(xhr);
                console.log(status);
                console.log(error);
            }
        });
    });
</script>
