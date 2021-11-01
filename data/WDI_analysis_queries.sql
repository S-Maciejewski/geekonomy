-- Find ones with the most data for given year
select "Indicator Code", "Indicator Name", count("1960") from "WDIData" where "1980" != '' and "1990" != '' and "2000" != '' and "2010" != '' group by ("Indicator Name", "Indicator Code");


-- Find countries for which popular indicators are sufficiently filled in recent years (in order not to discriminate young countries)
select "Country Code", "Country Name" from "WDIData" where 4 >
(case when "1990" != '' then 1 else 0 end +
case when "1995" != '' then 1 else 0 end +
case when "2000" != '' then 1 else 0 end +
case when "2005" != '' then 1 else 0 end +
case when "2010" != '' then 1 else 0 end +
case when "2015" != '' then 1 else 0 end)
and "Indicator Code" in
(
'SP.POP.GROW',
'SP.POP.TOTL',
'SP.RUR.TOTL.ZS',
'SP.URB.TOTL.IN.ZS',
'EN.POP.DNST',
'SP.POP.0014.TO.ZS',
'SP.POP.1564.TO.ZS',
'SP.POP.65UP.TO.ZS',
'SP.DYN.TO65.FE.ZS',
'SP.DYN.TO65.MA.ZS',
'IT.CEL.SETS.P2',
'SP.DYN.TFRT.IN',
'SP.DYN.LE00.IN',
'ER.FSH.PROD.MT',
'ER.FSH.CAPT.MT',
'AG.LND.AGRI.ZS',
'AG.LND.ARBL.ZS',
'EN.ATM.CO2E.KT',
'EN.ATM.CO2E.PC',
'TX.VAL.MRCH.CD.WT',
'TM.VAL.MRCH.CD.WT',
'IT.MLT.MAIN.P2',
'EN.ATM.CO2E.GF.KT',
'AG.PRD.CREL.MT',
'BX.KLT.DINV.CD.WD',
'NY.GDP.TOTL.RT.ZS',
'NY.GDP.MKTP.CD',
'NY.GDP.PCAP.CD',
'SP.DYN.IMRT.IN',
'EN.ATM.CO2E.KD.GD',
'SH.DTH.IMRT',
'NY.GDP.MKTP.KD.ZG',
'NY.GNP.MKTP.CD',
'EG.IMP.CONS.ZS',
'NE.EXP.GNFS.ZS',
'NE.IMP.GNFS.ZS',
'IS.AIR.PSGR',
'EG.ELC.HYRO.ZS',
'EG.ELC.NUCL.ZS',
'EG.ELC.FOSL.ZS',
'EG.ELC.RNWX.ZS',
'EN.URB.LCTY',
'EG.USE.ELEC.KH.PC',
'NY.GNP.PCAP.CD',
'FP.CPI.TOTL.ZG',
'MS.MIL.XPND.GD.ZS',
'FP.CPI.TOTL',
'SE.PRE.ENRR',
'SE.TER.ENRR',
'NY.GNS.ICTR.GN.ZS',
'SE.PRM.ENRL.TC.ZS',
'BN.CAB.XOKA.GD.ZS',
'SE.ENR.PRSC.FM.ZS',
'NY.GNS.ICTR.ZS',
'NY.GNP.PCAP.KD.ZG'
)
group by ("Country Code", "Country Name")


-- Find indicator - country pairs with most null values
select "Indicator Name", "Country Name", count(*) from "NewData" where "Value" is null group by ("Indicator Name", "Country Name") having count(*) > 50;

-- Find indicators with most missing year-entries for all countries
select r."Indicator Name", sum(r.count) "sum" from (select "Indicator Name", "Country Name", count(*) from "NewData" where "Value" is null group by ("Indicator Name", "Country Name") having count(*) > 50) r
group by (r."Indicator Name") order by "sum" desc;

-- Find indicators with most missing series for a country (countries with 0 entries for an indicator) (out of 208 countries and territories in NewData)
select r."Indicator Code", count(*) "missing_series" from (select "Indicator Code", "Country Name", count(*) from "NewData" where "Value" is null group by ("Indicator Code", "Country Name")) r
where r.count > 60 group by (r."Indicator Code") order by "missing_series" desc;


-- in this case removed 5 indicators (over 99 countries had no data for them: 
DT.DOD.DSTC.IR.ZS
FI.RES.TOTL.DT.ZS
DT.DOD.DSTC.ZS
DT.DOD.DIMF.CD
DT.TDS.DECT.GN.ZS
