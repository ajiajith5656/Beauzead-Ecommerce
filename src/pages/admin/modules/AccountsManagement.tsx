import React, { useEffect, useState } from 'react';
import adminApiService from '../../../services/admin/adminApiService';
import { Loading, ErrorMessage } from '../components/StatusIndicators';
import type {
  AccountSummary,
  DaybookEntry,
  BankBookEntry,
  AccountHead,
  ExpenseEntry,
  SellerPayout,
  MembershipPlan,
  TaxRule,
  PlatformCost,
} from '../../../types';

interface PaginationState {
  page: number;
  limit: number;
  total: number;
}

export const AccountsManagement: React.FC = () => {
  const [summary, setSummary] = useState<AccountSummary | null>(null);
  const [daybook, setDaybook] = useState<DaybookEntry[]>([]);
  const [bankBook, setBankBook] = useState<BankBookEntry[]>([]);
  const [accountHeads, setAccountHeads] = useState<AccountHead[]>([]);
  const [expenses, setExpenses] = useState<ExpenseEntry[]>([]);
  const [payouts, setPayouts] = useState<SellerPayout[]>([]);
  const [memberships, setMemberships] = useState<MembershipPlan[]>([]);
  const [taxRules, setTaxRules] = useState<TaxRule[]>([]);
  const [platformCosts, setPlatformCosts] = useState<PlatformCost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [daybookPagination, setDaybookPagination] = useState<PaginationState>({ page: 1, limit: 5, total: 0 });
  const [bankPagination, setBankPagination] = useState<PaginationState>({ page: 1, limit: 5, total: 0 });

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        const [
          summaryData,
          daybookData,
          bankBookData,
          headsData,
          expensesData,
          payoutsData,
          membershipsData,
          taxData,
          costData,
        ] = await Promise.all([
          adminApiService.getAccountSummary(),
          adminApiService.getDaybook(daybookPagination.page, daybookPagination.limit),
          adminApiService.getBankBook(bankPagination.page, bankPagination.limit),
          adminApiService.getAccountHeads(),
          adminApiService.getExpenses(1, 10),
          adminApiService.getSellerPayouts(1, 10),
          adminApiService.getMembershipPlans(),
          adminApiService.getTaxRules(),
          adminApiService.getPlatformCosts(),
        ]);

        setSummary(summaryData);
        setDaybook(daybookData?.entries || []);
        setDaybookPagination((prev) => ({ ...prev, total: daybookData?.total || 0 }));
        setBankBook(bankBookData?.entries || []);
        setBankPagination((prev) => ({ ...prev, total: bankBookData?.total || 0 }));
        setAccountHeads(headsData || []);
        setExpenses(expensesData?.expenses || []);
        setPayouts(payoutsData?.payouts || []);
        setMemberships(membershipsData || []);
        setTaxRules(taxData || []);
        setPlatformCosts(costData || []);
        setError(null);
      } catch (err) {
        setError('Failed to load account data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [daybookPagination.page, bankPagination.page]);

  if (loading) return <Loading message="Loading accounts..." />;

  return (
    <div className="space-y-6">
      {error && <ErrorMessage message={error} />}

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Accounts & Finance</h2>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">Total Revenue</p>
          <p className="text-xl font-bold text-gray-900">
            {summary ? `${summary.currency} ${summary.total_revenue.toLocaleString()}` : '—'}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">Total Expenses</p>
          <p className="text-xl font-bold text-gray-900">
            {summary ? `${summary.currency} ${summary.total_expenses.toLocaleString()}` : '—'}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">Net Profit</p>
          <p className="text-xl font-bold text-gray-900">
            {summary ? `${summary.currency} ${summary.net_profit.toLocaleString()}` : '—'}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">Seller Payouts</p>
          <p className="text-xl font-bold text-gray-900">
            {summary ? `${summary.currency} ${summary.total_payouts.toLocaleString()}` : '—'}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">Total Taxes</p>
          <p className="text-xl font-bold text-gray-900">
            {summary ? `${summary.currency} ${summary.total_taxes.toLocaleString()}` : '—'}
          </p>
        </div>
      </div>

      {/* Daybook */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Daybook</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Description</th>
                <th className="px-4 py-2 text-right text-sm font-semibold text-gray-700">Debit</th>
                <th className="px-4 py-2 text-right text-sm font-semibold text-gray-700">Credit</th>
                <th className="px-4 py-2 text-right text-sm font-semibold text-gray-700">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {daybook.length > 0 ? (
                daybook.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-700">{entry.date}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{entry.description}</td>
                    <td className="px-4 py-2 text-sm text-gray-700 text-right">{entry.debit.toLocaleString()}</td>
                    <td className="px-4 py-2 text-sm text-gray-700 text-right">{entry.credit.toLocaleString()}</td>
                    <td className="px-4 py-2 text-sm text-gray-700 text-right">{entry.balance.toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                    No daybook entries
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bank Book */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Bank Book</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Description</th>
                <th className="px-4 py-2 text-right text-sm font-semibold text-gray-700">Debit</th>
                <th className="px-4 py-2 text-right text-sm font-semibold text-gray-700">Credit</th>
                <th className="px-4 py-2 text-right text-sm font-semibold text-gray-700">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {bankBook.length > 0 ? (
                bankBook.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-700">{entry.date}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{entry.description}</td>
                    <td className="px-4 py-2 text-sm text-gray-700 text-right">{entry.debit.toLocaleString()}</td>
                    <td className="px-4 py-2 text-sm text-gray-700 text-right">{entry.credit.toLocaleString()}</td>
                    <td className="px-4 py-2 text-sm text-gray-700 text-right">{entry.balance.toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                    No bank book entries
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Account Heads */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Account Heads</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {accountHeads.length > 0 ? (
            accountHeads.map((head) => (
              <div key={head.id} className="border border-gray-200 rounded-lg p-3">
                <p className="font-semibold text-gray-900">{head.name}</p>
                <p className="text-xs text-gray-500 uppercase">{head.type}</p>
                <span className={`text-xs font-semibold ${head.is_active ? 'text-green-600' : 'text-red-600'}`}>
                  {head.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No account heads available</p>
          )}
        </div>
      </div>

      {/* Expenses & Payouts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Expenses</h3>
          <ul className="space-y-2">
            {expenses.length > 0 ? (
              expenses.map((expense) => (
                <li key={expense.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">{expense.category}</span>
                  <span className="font-semibold text-gray-900">{expense.amount.toLocaleString()}</span>
                </li>
              ))
            ) : (
              <li className="text-gray-500">No expenses available</li>
            )}
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Seller Payouts</h3>
          <ul className="space-y-2">
            {payouts.length > 0 ? (
              payouts.map((payout) => (
                <li key={payout.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">{payout.seller_id}</span>
                  <span className="font-semibold text-gray-900">{payout.amount.toLocaleString()}</span>
                </li>
              ))
            ) : (
              <li className="text-gray-500">No payouts available</li>
            )}
          </ul>
        </div>
      </div>

      {/* Memberships, Taxes, Costs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Membership Plans</h3>
          <ul className="space-y-2">
            {memberships.length > 0 ? (
              memberships.map((plan) => (
                <li key={plan.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">{plan.name}</span>
                  <span className="font-semibold text-gray-900">{plan.price.toLocaleString()}</span>
                </li>
              ))
            ) : (
              <li className="text-gray-500">No plans available</li>
            )}
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Taxes</h3>
          <ul className="space-y-2">
            {taxRules.length > 0 ? (
              taxRules.map((tax) => (
                <li key={tax.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">{tax.name}</span>
                  <span className="font-semibold text-gray-900">{tax.percentage}%</span>
                </li>
              ))
            ) : (
              <li className="text-gray-500">No tax rules available</li>
            )}
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Platform Costs</h3>
          <ul className="space-y-2">
            {platformCosts.length > 0 ? (
              platformCosts.map((cost) => (
                <li key={cost.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">{cost.name}</span>
                  <span className="font-semibold text-gray-900">{cost.amount.toLocaleString()}</span>
                </li>
              ))
            ) : (
              <li className="text-gray-500">No platform costs available</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AccountsManagement;
