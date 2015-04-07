<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true"
    CodeBehind="Projects.aspx.cs" Inherits="PersonalWorkManagerWeb.Pages.Projects" %>

<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
    <script src="Projects.js" type="text/javascript"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <div class="row">
        <div class="col-lg-12">
            <h1 class="page-header">Projectos</h1>
        </div>
    </div>
    <div class="panel panel-default container-fluid">
        <div class="panel-body">
            <form class="form-horizontal">
            <div class="form-group">
                <label class="control-label col-sm-1" for="ddlProject">Projecto: </label>
                <div class="col-sm-11">
                    <select id="ddlProject" placeholder="Escolha um projecto ...">
                    </select>
                </div>
            </div>
            </form>
        </div>

        <button id="btnNew" type="button" class="btn btn-default" onclick="newProject();">
            <i class="glyphicon glyphicon-plus"></i>&nbsp;Novo
        </button>
        <button id="btnSave" type="button" class="btn btn-default" onclick="saveProject();">
            <i class="glyphicon glyphicon-floppy-save"></i>&nbsp;Guardar
        </button>
        <button id="btnRemove" type="button" class="btn btn-default" onclick="removeProject();">
            <i class="glyphicon glyphicon-remove"></i>&nbsp;Remover
        </button>
        <button id="btnCancel" type="button" class="btn btn-default" onclick="cancelNew();">
            <i class="glyphicon glyphicon-arrow-left"></i>&nbsp;Cancelar
        </button>
        <p></p>

        <ul class="nav nav-tabs">
            <li class="active"><a href="#tabMain" data-toggle="tab">Projecto</a></li>
            <li><a href="#tabTasks" data-toggle="tab">Tarefas</a></li>
            <li><a href="#tabAlerts" data-toggle="tab">Alertas</a></li>
            <li><a href="#tabNotes" data-toggle="tab">Notas</a></li>
            <li><a href="#tabSessions" data-toggle="tab">Sessões</a></li>
        </ul>
        <div class="tab-content">
            <div class="tab-pane active" id="tabMain">
                <div class="container-fluid">
                    <p>
                    </p>
                    <form class="form-horizontal">
                        <input type="hidden" id="txtId"/>
                        <div class="form-group">
                            <label class="control-label col-sm-2" for="txtCode">Código: </label>
                            <div class="col-md-2">
                                <input type="text" class="form-control" id="txtCode" placeholder="Código">
                            </div>
                            <label class="control-label col-sm-1" for="txtName">Nome: </label>
                            <div class="col-sm-7">
                                <input type="text" class="form-control" id="txtName" placeholder="Nome">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label col-sm-2" for="txtDescription">Descrição: </label>
                            <div class="col-sm-10">
                                <textarea class="form-control" rows="5" id="txtDescription" placeholder="Descrição"></textarea>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label col-sm-2" for="txtStartDate">Data Inicio: </label>
                            <div class="col-md-4">
                                <div class="input-group" id="txtStartDate">
                                    <input type="text" class="form-control" placeholder="Data Início">
                                    <span class="input-group-addon">
                                        <span class="glyphicon glyphicon-calendar"></span>
                                    </span>
                                </div>
                            </div>
                            <label class="control-label col-sm-2" for="txtEndDate">Data Fim: </label>
                            <div class="col-md-4">
                                <div class="input-group" id="txtEndDate">
                                    <input type="text" class="form-control" placeholder="Data Fim">
                                    <span class="input-group-addon">
                                        <span class="glyphicon glyphicon-calendar"></span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="control-label col-sm-2" for="ddlStatus">Estado: </label>
                            <div class="col-sm-10">
                                <select class="form-control" id="ddlStatus">
                                </select>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        <div class="tab-pane" id="tabTasks">
            ... Tarefas ...
        </div>
        <div class="tab-pane" id="tabAlerts">
            ... Alertas ...
        </div>
        <div class="tab-pane" id="tabNotes">
            ... Notas ...
        </div>
        <div class="tab-pane" id="tabSessions">
            ... Sessões ...
        </div>
    </div>
    </div>
</asp:Content>
