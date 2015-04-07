using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;

namespace PersistableMultiTimer {
    public partial class frmTimerSessionsForm : Form {

        long _idTimer;

        public frmTimerSessionsForm() {
            InitializeComponent();
        }

        private void btnAdd_Click(object sender, EventArgs e) {
            frmTimerSessionForm frm = new frmTimerSessionForm();
            if (frm.ShowAdd(this, _idTimer) == DialogResult.OK)
                refreshTimerSessions();
        }
        private void btnEdit_Click(object sender, EventArgs e) {
            if (this.lvwTimerSessions.SelectedItems.Count > 0) {
                ListViewItem lvi = this.lvwTimerSessions.SelectedItems[0];
                frmTimerSessionForm frm = new frmTimerSessionForm();
                if (frm.ShowEdit(this, _idTimer, Convert.ToInt64(lvi.Tag)) == DialogResult.OK)
                    refreshTimerSessions();
            }
        }
        private void btnDelete_Click(object sender, EventArgs e) {

            if (this.lvwTimerSessions.SelectedItems.Count > 0) {
                if (MessageBox.Show("Confirm delete of timer session ?", "Timer Delete", MessageBoxButtons.YesNoCancel) == DialogResult.Yes) {
                    long id = Convert.ToInt64(this.lvwTimerSessions.SelectedItems[0].Tag);
                    using (var objCtx = new TimersDBEntities()) {

                        // Get timer sessions
                        var timerSession = (from ts in objCtx.TimerSession
                                            where ts.Id == id
                                            select ts).FirstOrDefault();

                        // Delete timer session
                        objCtx.TimerSession.DeleteObject(timerSession);

                        // Commit changes
                        objCtx.SaveChanges();
                    }

                    refreshTimerSessions();
                    setFormStatus(false);
                }
            }

        }
        private void btnExit_Click(object sender, EventArgs e) {
            this.Close();
        }
        private void lvwTimerSessions_SelectedIndexChanged(object sender, EventArgs e) {
            if (this.lvwTimerSessions.SelectedItems.Count > 0) {
                setFormStatus(true);
            } else {
                setFormStatus(false);
            }
        }

        private void refreshTimerSessions() {

            this.lvwTimerSessions.Items.Clear();

            using (var objCtx = new TimersDBEntities()) {
                // Get Timer
                var timer = (from t in objCtx.Timer
                             where t.Id == _idTimer
                             select t).FirstOrDefault();

                foreach (TimerSession timersession in timer.TimerSession) {
                    ListViewItem lvi = new ListViewItem(timersession.StartDate.ToString());
                    lvi.Tag = timersession.Id;
                    lvi.SubItems.Add(timersession.EndDate.ToString());
                    TimeSpan sessionsSpan = TimeSpan.FromSeconds(timersession.TotalSeconds);
                    lvi.SubItems.Add(sessionsSpan.ToString());
                    this.lvwTimerSessions.Items.Add(lvi);
                }
            }

        }
        private void setFormStatus(bool SessionSelected) {
            //this.lvwTimerSessions.Enabled = true;
            //this.btnAdd.Enabled = true;
            this.btnEdit.Enabled = SessionSelected;
            this.btnDelete.Enabled = SessionSelected;

        }
        public void Show(Form Owner, long IdTimer) {

            _idTimer = IdTimer;
            refreshTimerSessions();
            this.ShowDialog(Owner);

            return;
        }

        private void frmTimerSessionsForm_Load(object sender, EventArgs e)
        {

        }

    }
}
