namespace PersonalWorkManagerWeb
{

    using System.Linq;

    public class DBUtil
    {

        public enum StatusTypes
        {
            Project = 1,
            Task,
            Alert,
            Resource
        }

        public void InitDataBase()
        {

            // Iniciar a base de dados com os dados minimos
            using (var objCtx = new PWMEntities())
            {
                // Statuss:
                Status Status = null;

                var Statuss = from t in objCtx.Status
                               select t;
                if (Statuss.Count<Status>() == 0)
                {
                    Status = new Status() { Name = "Activo", Description = "Activo", IdStatusType = (long)StatusTypes.Project };
                    objCtx.Status.AddObject(Status);
                    Status = new Status() { Name = "Activo", Description = "Activo", IdStatusType = (long)StatusTypes.Task };
                    objCtx.Status.AddObject(Status);
                    Status = new Status() { Name = "Activo", Description = "Activo", IdStatusType = (long)StatusTypes.Alert };
                    objCtx.Status.AddObject(Status);
                    Status = new Status() { Name = "Activo", Description = "Activo", IdStatusType = (long)StatusTypes.Resource };
                    objCtx.Status.AddObject(Status);
                    objCtx.SaveChanges();
                }

                // Utilizadores
                Resource Resource = null;

                var Resources = from t in objCtx.Resource
                                select t;
                if (Resources.Count<Resource>() == 0)
                {
                    Resource = new Resource() { Login = "Admin", Name = "Admin", Password = string.Empty, IdStatus = (long)StatusTypes.Resource };
                    objCtx.Resource.AddObject(Resource);
                    objCtx.SaveChanges();
                }
            }

        }

    }
}