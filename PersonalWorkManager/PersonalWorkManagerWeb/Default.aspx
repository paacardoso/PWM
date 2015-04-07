<%@ Page Title="Home Page" Language="C#" MasterPageFile="~/Site.master" AutoEventWireup="true"
    CodeBehind="Default.aspx.cs" Inherits="PersonalWorkManagerWeb._Default" %>

<asp:Content ID="HeaderContent" runat="server" ContentPlaceHolderID="HeadContent">
</asp:Content>
<asp:Content ID="BodyContent" runat="server" ContentPlaceHolderID="MainContent">
    <div class="row">
        <div class="col-lg-12">
            <h1 class="page-header">PWM</h1>
        </div>
    </div>
    <h2>
        Bem Vindo ...
    </h2>
    <p>
      O <abbr title="Personal Work Manager">PWM</abbr> é uma solução que permite gestão de várias informações relacionadas com o dia-a-dia de cada pessoa.
      <br>Nesta 1ª versão, permite a gestão de projectos pessoais e profissionais.
      <br>Para cada projecto, é possível atribuir notas, tarefas, alertas um estado (Activo, Pendente, ...).
      <br>Será contabilizado o tempo em que trabalhou nesse projecto de forma a poder ser efectuado um cálculo sobre o tempo que foi consumido.
      <% if (!Page.User.Identity.IsAuthenticated) { %>
      <p></p>
      <br>Clique em <a href="~/Login.aspx" id="HeadLoginStatus" runat="server"><i class="fa fa-sign-in fa-fw"></i> Entrar</a> para iniciar a sessão.
      <% } %>
    </p>
</asp:Content>
