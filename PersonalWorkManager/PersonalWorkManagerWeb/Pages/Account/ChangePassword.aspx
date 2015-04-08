<%@ Page Title="Log In" Language="C#" MasterPageFile="~/Site.master" AutoEventWireup="True"
    CodeBehind="ChangePassword.aspx.cs" Inherits="PersonalWorkManagerWeb.ChangePassword" %>

<asp:Content ID="HeaderContent" runat="server" ContentPlaceHolderID="HeadContent">
</asp:Content>
<asp:Content ID="BodyContent" runat="server" ContentPlaceHolderID="MainContent">
    <div class="row">
        <div class="col-lg-12">
            <h1 class="page-header">Alterar Senha</h1>
        </div>
    </div>
    <div class="row">
        <div class="col-lg-3">
        </div>
        <div class="col-lg-6">
            <h3>Introduza a sua nova senha:</h3>
            <form class="form-inline" role="form">
            <div class="form-group">
                <label class="control-label" for="txtOldPassword">Senha actual: </label>
                <input type="text" class="form-control" id="txtOldPassword" placeholder="Senha actual">
            </div>
            <div class="form-group">
                <label class="control-label" for="txtNewPassword">Senha nova: </label>
                <input type="text" class="form-control" id="txtNewPassword" placeholder="Senha nova">
            </div>
            <div class="form-group">
                <label class="control-label" for="txtConfirmPassword">Corfirmar Senha: </label>
                <input type="text" class="form-control" id="txtConfirmPassword" placeholder="Confirmar senha">
            </div>
            <div class="modal-footer">
            <button id="btnCancel" type="button" class="btn btn-default" onclick="updatePassword();">
                Cancelar</button>
            <button id="btnSave" type="button" class="btn btn-primary" onclick="cancelChange();">
                Guardar</button>
            </div>
        </div>
        <div class="col-lg-3">
        </div>
    </div>
</asp:Content>
