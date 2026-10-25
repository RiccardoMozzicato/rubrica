<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <title>Rubrica - Lista contatti</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/style.css">
</head>
<body>
<h1>Rubrica</h1>

<div class="toolbar">
    <a class="btn" href="${pageContext.request.contextPath}/editor">NUOVO</a>
    <a class="link" href="${pageContext.request.contextPath}/app/">Versione React</a>
</div>

<table>
    <thead>
    <tr>
        <th>Id</th>
        <th>Nome</th>
        <th>Cognome</th>
        <th>Telefono</th>
        <th></th>
        <th></th>
    </tr>
    </thead>
    <tbody>
    <c:forEach var="p" items="${persone}">
        <tr>
            <td>${p.id()}</td>
            <td><c:out value="${p.nome()}"/></td>
            <td><c:out value="${p.cognome()}"/></td>
            <td><c:out value="${p.telefono()}"/></td>
            <td>
                <a class="btn" href="${pageContext.request.contextPath}/editor?id=${p.id()}">MODIFICA</a>
            </td>
            <td>
                <form method="post" action="${pageContext.request.contextPath}/elimina/${p.id()}">
                    <button type="submit" class="btn btn-danger">ELIMINA</button>
                </form>
            </td>
        </tr>
    </c:forEach>
    <c:if test="${empty persone}">
        <tr><td colspan="6">Nessun contatto in rubrica</td></tr>
    </c:if>
    </tbody>
</table>
</body>
</html>
