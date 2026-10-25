<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <title>Rubrica - Errore</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/style.css">
</head>
<body>
<h1>Errore</h1>
<p><c:out value="${messaggio}"/></p>
<a class="btn" href="${pageContext.request.contextPath}/lista">Torna alla lista</a>
</body>
</html>
