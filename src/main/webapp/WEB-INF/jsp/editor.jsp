<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <title>Rubrica - Editor contatto</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/style.css">
</head>
<body>
<h1>${persona.isNuova() ? 'Nuovo contatto' : 'Modifica contatto'}</h1>

<form:form method="post" action="${pageContext.request.contextPath}/salva" modelAttribute="persona">
    <form:hidden path="id"/>

    <div class="field">
        <form:label path="nome">Nome</form:label>
        <form:input path="nome"/>
        <form:errors path="nome" cssClass="error"/>
    </div>
    <div class="field">
        <form:label path="cognome">Cognome</form:label>
        <form:input path="cognome"/>
        <form:errors path="cognome" cssClass="error"/>
    </div>
    <div class="field">
        <form:label path="indirizzo">Indirizzo</form:label>
        <form:input path="indirizzo"/>
        <form:errors path="indirizzo" cssClass="error"/>
    </div>
    <div class="field">
        <form:label path="telefono">Telefono</form:label>
        <form:input path="telefono" type="tel"/>
        <form:errors path="telefono" cssClass="error"/>
    </div>
    <div class="field">
        <form:label path="eta">Età</form:label>
        <form:input path="eta" type="number" min="0" max="150"/>
        <form:errors path="eta" cssClass="error"/>
    </div>

    <div class="actions">
        <button type="submit" class="btn">SALVA</button>
        <a class="btn btn-secondary" href="${pageContext.request.contextPath}/lista">ANNULLA</a>
    </div>
</form:form>
</body>
</html>
