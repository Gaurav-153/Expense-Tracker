from django.urls import path
from .views import signup, login, add_expense, manage_expense, expense_detail ,expense_report,change_password,dashboard_summary

urlpatterns = [
    path('signup/', signup, name="signup"),
    path('login/', login, name="login"),
    path('add_expense/', add_expense, name="add_expense"),
    path('manage_expense/<int:user_id>/', manage_expense, name="manage_expense"),
    path('expense/<int:expense_id>/', expense_detail, name="expense_detail"),
    path('expense_report/<int:user_id>/', expense_report),
    path('change_password/', change_password, name="change_password"),
    path('dashboard_summary/<int:user_id>/', dashboard_summary, name='dashboard_summary'),

]
