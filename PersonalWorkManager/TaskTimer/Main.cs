using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;

namespace PersistableMultiTimer {
    public partial class frmMain : Form {

        long activeTimerSessionId;

        public frmMain() {
            InitializeComponent();
        }

        private void frmMain_Load(object sender, EventArgs e) {
            refreshTimers();
        }
        private void frmMain_SizeChanged(object sender, EventArgs e) {
            setProgressBarPosition(this.lvwTimers.SelectedItems[0]);
        }
        private void timerControl_Tick(object sender, EventArgs e) {
            using (var objCtx = new TimersDBEntities()) {
                // Get timer session
                var timerSession = (from ts in objCtx.TimerSession
                                    where ts.Id == activeTimerSessionId
                                    select ts).FirstOrDefault();

                timerSession.EndDate = DateTime.Now;
                timerSession.TotalSeconds = Convert.ToInt64(DateTime.Now.Subtract(timerSession.StartDate).TotalSeconds);

                objCtx.SaveChanges();
            }
        }
        private void lvwTimers_SelectedIndexChanged(object sender, EventArgs e) {

            if (this.lvwTimers.SelectedItems.Count > 0) {
                using (var objCtx = new TimersDBEntities()) {
                    var timerName = this.lvwTimers.SelectedItems[0].Text;
                    //var timer = objCtx.Timer.SingleOrDefault(x => x.Name == this.lvwTimers.SelectedItems[0].Text); --> Dá erro. Alterar 'this.lvwTimers.SelectedItems[0].Text' por 'TimerName'.
                    var timer = (from t in objCtx.Timer
                                 where t.Name == timerName
                                 select t).FirstOrDefault<Timer>();
                    this.lblDescription.Text = timer.Description;
                }
                setFormStatus(false, true);
            } else {
                setFormStatus(false, false);
            }

        }

        private void btnStart_Click(object sender, EventArgs e) {
            if (this.lvwTimers.SelectedItems.Count > 0) {
                var selectedLI = this.lvwTimers.SelectedItems[0];
                var timerName = selectedLI.Text;
                using (var objCtx = new TimersDBEntities()) {
                    // GetTimer
                    var timer = (from t in objCtx.Timer
                                 where t.Name == timerName
                                 select t).FirstOrDefault();

                    var timerSession = new TimerSession();
                    timerSession.StartDate = DateTime.Now;
                    timerSession.EndDate = DateTime.Now;
                    timerSession.TotalSeconds = 0;
                    timerSession.IdTimer = timer.Id;

                    objCtx.TimerSession.AddObject(timerSession);
                    objCtx.SaveChanges();

                    activeTimerSessionId = timerSession.Id;
                }

                setFormStatus(true, true);
                this.timerControl.Start();

                // Move progress bar
                setProgressBarPosition(selectedLI);

                this.progressBar.Visible = true;
            }
        }
        private void btnStop_Click(object sender, EventArgs e) {
            this.progressBar.Visible = false;
            this.timerControl.Stop();
            setFormStatus(false, true);
            refreshTimers();
        }
        private void btnSessions_Click(object sender, EventArgs e) {
            if (this.lvwTimers.SelectedItems.Count > 0) {
                ListViewItem lvi = this.lvwTimers.SelectedItems[0];
                frmTimerSessionsForm frm = new frmTimerSessionsForm();
                frm.Show(this, Convert.ToInt64(lvi.Tag));
            }
        }
        private void btnAdd_Click(object sender, EventArgs e) {
            frmTimerForm frm = new frmTimerForm();
            if (frm.ShowAdd(this) == DialogResult.OK)
                refreshTimers();
        }
        private void btnEdit_Click(object sender, EventArgs e) {
            if (this.lvwTimers.SelectedItems.Count > 0) {
                ListViewItem lvi = this.lvwTimers.SelectedItems[0];
                frmTimerForm frm = new frmTimerForm();
                if (frm.ShowEdit(this, Convert.ToInt64(lvi.Tag)) == DialogResult.OK)
                    refreshTimers();
            }
        }
        private void btnDelete_Click(object sender, EventArgs e) {

            if (this.lvwTimers.SelectedItems.Count > 0) {
                ListViewItem lvi = this.lvwTimers.SelectedItems[0];
                if (MessageBox.Show("Confirm delete of timer '" + lvi.SubItems[0].Text + "' ?", "Timer Delete", MessageBoxButtons.YesNoCancel) == DialogResult.Yes) {
                    long id = Convert.ToInt64(this.lvwTimers.SelectedItems[0].Tag);
                    using (var objCtx = new TimersDBEntities()) {
                        // GetTimer
                        var timer = (from t in objCtx.Timer
                                     where t.Id == id
                                     select t).FirstOrDefault();

                        // Get timer sessions list
                        var timersessions = (from ts in objCtx.TimerSession
                                             where ts.IdTimer == timer.Id
                                             select ts).ToList<TimerSession>();

                        // Delete timer sessions
                        foreach (var ts in timersessions) {
                            objCtx.TimerSession.DeleteObject(ts);
                        }

                        // Delete timer
                        objCtx.Timer.DeleteObject(timer);

                        // Commit changes
                        objCtx.SaveChanges();
                    }

                    refreshTimers();
                    setFormStatus(false, false);
                }
            }

        }
        private void btnExit_Click(object sender, EventArgs e) {
            this.Close();
        }

        private void refreshTimers() {

            this.lvwTimers.Items.Clear();

            using (var objCtx = new TimersDBEntities()) {
                foreach (Timer timer in objCtx.Timer) {

                    ListViewItem lvi = new ListViewItem(timer.Name);

                    lvi.Tag = timer.Id;

                    string startDate = "";
                    string endDate = "";
                    double totalSeconds = 0;

                    if (timer.TimerSession.Count > 0) {
                        startDate = (from ts in objCtx.TimerSession select ts.StartDate).Min().ToString();
                        endDate = (from ts in objCtx.TimerSession select ts.EndDate).Max().ToString();
                        totalSeconds = (from ts in objCtx.TimerSession select ts.TotalSeconds).Sum();
                    }

                    TimeSpan sessionsSpan = TimeSpan.FromSeconds(totalSeconds);

                    lvi.SubItems.Add(startDate);
                    lvi.SubItems.Add(endDate);
                    lvi.SubItems.Add(sessionsSpan.ToString());
                    this.lvwTimers.Items.Add(lvi);
                }
            }

        }
        private void setFormStatus(bool TimerEnabled, bool TimerSelected) {
            this.lvwTimers.Enabled = !TimerEnabled;
            this.btnStart.Enabled = !TimerEnabled && TimerSelected;
            this.btnStop.Enabled = TimerEnabled && TimerSelected;
            this.btnSessions.Enabled = !TimerEnabled && TimerSelected;
            this.btnAdd.Enabled = !TimerEnabled;
            this.btnEdit.Enabled = !TimerEnabled && TimerSelected;
            this.btnDelete.Enabled = !TimerEnabled && TimerSelected;

        }
        private void setProgressBarPosition(ListViewItem selectedLI) {
            this.progressBar.Left = this.lvwTimers.Left + selectedLI.SubItems[1].Bounds.Left + 3;
            this.progressBar.Top = this.lvwTimers.Top + selectedLI.SubItems[1].Bounds.Top + 3;
            this.progressBar.Width = selectedLI.SubItems[1].Bounds.Width + selectedLI.SubItems[2].Bounds.Width + selectedLI.SubItems[3].Bounds.Width - 3;
            if (this.progressBar.Left + this.progressBar.Width > this.lvwTimers.Left + this.lvwTimers.Width)
                this.progressBar.Width = this.lvwTimers.Left + this.lvwTimers.Width - this.lvwTimers.Left - selectedLI.SubItems[1].Bounds.Left - 3;

        }

    }
}
