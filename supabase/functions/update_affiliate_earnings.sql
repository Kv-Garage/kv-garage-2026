-- Function to update affiliate earnings when a conversion is created
CREATE OR REPLACE FUNCTION update_affiliate_earnings(
  p_affiliate_id UUID,
  p_commission_amount DECIMAL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update affiliate earnings
  UPDATE affiliates 
  SET 
    total_earnings = total_earnings + p_commission_amount,
    pending_earnings = pending_earnings + p_commission_amount
  WHERE id = p_affiliate_id;
END;
$$;

-- Function to update affiliate paid earnings when a payout is marked as paid
CREATE OR REPLACE FUNCTION update_affiliate_paid_earnings(
  p_affiliate_id UUID,
  p_amount DECIMAL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update affiliate earnings
  UPDATE affiliates 
  SET 
    pending_earnings = pending_earnings - p_amount,
    paid_earnings = paid_earnings + p_amount
  WHERE id = p_affiliate_id;
END;
$$;