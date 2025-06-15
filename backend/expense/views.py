import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import UserDetail, Expense
from django.utils.timezone import now, timedelta
from django.db.models import Sum

# Signup API
@csrf_exempt
def signup(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        fullname = data.get('FullName')
        email = data.get('Email')
        password = data.get('Password')

        if UserDetail.objects.filter(Email=email).exists():
            return JsonResponse({'message': 'Email already exists'}, status=400)

        UserDetail.objects.create(FullName=fullname, Email=email, Password=password)
        return JsonResponse({'message': 'User registered successfully'}, status=201)


# Login API
@csrf_exempt
def login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('Email')
        password = data.get('Password')

        try:
            user = UserDetail.objects.get(Email=email, Password=password)
            return JsonResponse({'message': 'Login Successful', 'userId': user.id, 'userName': user.FullName}, status=200)
        except UserDetail.DoesNotExist:
            return JsonResponse({'message': 'Invalid Credentials'}, status=400)


# Add Expense API
@csrf_exempt
def add_expense(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user_id = data.get('UserId')
        expense_date = data.get('ExpenseDate')
        expense_item = data.get('ExpenseItem')
        expense_cost = data.get('ExpenseCost')

        try:
            user = UserDetail.objects.get(id=user_id)
            Expense.objects.create(
                UserId=user,
                ExpenseDate=expense_date,
                ExpenseItem=expense_item,
                ExpenseCost=expense_cost
            )
            return JsonResponse({'message': 'Expense added successfully'}, status=201)
        except Exception as e:
            return JsonResponse({'message': 'Something went wrong', 'error': str(e)}, status=400)


# View Expenses for a user
@csrf_exempt
def manage_expense(request, user_id):
    if request.method == 'GET':
        expenses = Expense.objects.filter(UserId=user_id)
        expense_list = list(expenses.values())
        return JsonResponse(expense_list, safe=False)


# Handle both UPDATE and DELETE for a single expense
@csrf_exempt
def expense_detail(request, expense_id):
    try:
        expense = Expense.objects.get(id=expense_id)

        if request.method == 'PUT':
            data = json.loads(request.body)
            expense.ExpenseDate = data.get('ExpenseDate', expense.ExpenseDate)
            expense.ExpenseItem = data.get('ExpenseItem', expense.ExpenseItem)
            expense.ExpenseCost = data.get('ExpenseCost', expense.ExpenseCost)
            expense.save()
            return JsonResponse({'message': 'Expense updated successfully'}, status=200)

        elif request.method == 'DELETE':
            expense.delete()
            return JsonResponse({'message': 'Expense deleted successfully'}, status=200)

        else:
            return JsonResponse({'message': 'Method not allowed'}, status=405)

    except Expense.DoesNotExist:
        return JsonResponse({'message': 'Expense not found'}, status=404)
    except Exception as e:
        return JsonResponse({'message': 'Something went wrong', 'error': str(e)}, status=400)


#Expense Report API
@csrf_exempt
def expense_report(request, user_id):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            from_date = data.get('from_date')
            to_date = data.get('to_date')

            expenses = Expense.objects.filter(
                UserId=user_id,
                ExpenseDate__range=[from_date, to_date]
            ).values()

            total = sum(float(e['ExpenseCost']) for e in expenses)

            return JsonResponse({
                'expenses': list(expenses),
                'total': total
            })

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

#Change Password API
@csrf_exempt
def change_password(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_id = data.get('user_id')
            old_password = data.get('old_password')
            new_password = data.get('new_password')
            confirm_password = data.get('confirm_password')

            if not all([user_id, old_password, new_password, confirm_password]):
                return JsonResponse({'error': 'All fields are required'}, status=400)

            user = UserDetail.objects.get(id=user_id)

            if user.Password != old_password:
                return JsonResponse({'error': 'Old password is incorrect'}, status=400)

            if new_password != confirm_password:
                return JsonResponse({'error': 'New passwords do not match'}, status=400)

            user.Password = new_password
            user.save()
            return JsonResponse({'message': 'Password changed successfully'}, status=200)

        except UserDetail.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
        

@csrf_exempt
def dashboard_summary(request, user_id):
    if request.method == 'GET':
        try:
            today = now().date()
            yesterday = today - timedelta(days=1)
            last_7 = today - timedelta(days=7)
            last_30 = today - timedelta(days=30)
            current_year = today.year

            # Filter user's expenses
            expenses = Expense.objects.filter(UserId=user_id)

            # Totals
            today_total = expenses.filter(ExpenseDate=today).aggregate(total=Sum('ExpenseCost'))['total'] or 0
            yesterday_total = expenses.filter(ExpenseDate=yesterday).aggregate(total=Sum('ExpenseCost'))['total'] or 0
            week_total = expenses.filter(ExpenseDate__gte=last_7).aggregate(total=Sum('ExpenseCost'))['total'] or 0
            month_total = expenses.filter(ExpenseDate__gte=last_30).aggregate(total=Sum('ExpenseCost'))['total'] or 0
            year_total = expenses.filter(ExpenseDate__year=current_year).aggregate(total=Sum('ExpenseCost'))['total'] or 0
            grand_total = expenses.aggregate(total=Sum('ExpenseCost'))['total'] or 0

            # Pie chart: Item-wise breakdown
            pie_data = expenses.values('ExpenseItem').annotate(total=Sum('ExpenseCost'))

            return JsonResponse({
                'today_total': today_total,
                'yesterday_total': yesterday_total,
                'week_total': week_total,
                'month_total': month_total,
                'year_total': year_total,
                'grand_total': grand_total,
                'pie_data': list(pie_data)
            }, status=200)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)