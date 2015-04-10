<%@ Page Title="Log In" Language="C#" MasterPageFile="~/Site.master" AutoEventWireup="True"
    CodeBehind="Login.aspx.cs" Inherits="PersonalWorkManagerWeb.Login" %>

<asp:Content ID="HeaderContent" runat="server" ContentPlaceHolderID="HeadContent">
    <script src="Login.js" type="text/javascript"></script>
</asp:Content>
<asp:Content ID="BodyContent" runat="server" ContentPlaceHolderID="MainContent">
    <div class="row">
        <div class="col-lg-12">
            <h1 class="page-header">Entrar</h1>
        </div>
    </div>
    <div class="row">
        <div class="col-lg-3">
        </div>
        <div class="col-lg-6">
            <h3>Introduza o seu login e a senha:</h3>
            <form class="form-inline" role="form">
            <div class="form-group">
                <label for="email">Login:</label>
                <input type="text" class="form-control" id="txtLogin" placeholder="Login">
            </div>
            <div class="form-group">
                <label for="pwd">Senha:</label>
                <input type="password" class="form-control" id="txtPassword" placeholder="Senha">
            </div>
            <div class="checkbox">
                <label><input type="checkbox" runat="server" id="chkPersistLoginCookie" />Manter sessão activa</label>
            </div>
            <button id="btnLogin" type="button" class="btn btn-primary" onclick="login();">Entrar</button>
        </div>
        <div class="col-lg-3">
        </div>
    </div>
</asp:Content>
