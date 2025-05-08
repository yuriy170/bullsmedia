--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.0

-- Started on 2025-05-08 16:51:20 IDT

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA public;


--
-- TOC entry 3716 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 218 (class 1259 OID 16445)
-- Name: affiliate_links; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.affiliate_links (
    id integer NOT NULL,
    is_active boolean DEFAULT true,
    keyword text,
    src text,
    creative text,
    version integer,
    generated_param text,
    fingerprint character varying(64),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone
);


--
-- TOC entry 217 (class 1259 OID 16444)
-- Name: affiliate_links_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.affiliate_links_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3717 (class 0 OID 0)
-- Dependencies: 217
-- Name: affiliate_links_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.affiliate_links_id_seq OWNED BY public.affiliate_links.id;


--
-- TOC entry 3558 (class 2604 OID 16448)
-- Name: affiliate_links id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.affiliate_links ALTER COLUMN id SET DEFAULT nextval('public.affiliate_links_id_seq'::regclass);


--
-- TOC entry 3561 (class 1259 OID 16993)
-- Name: idx_fingerprint_is_active_version; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_fingerprint_is_active_version ON public.affiliate_links USING btree (fingerprint, is_active, version DESC);


--
-- TOC entry 3562 (class 1259 OID 16995)
-- Name: idx_generated_param_active_version; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_generated_param_active_version ON public.affiliate_links USING btree (generated_param, is_active, version DESC);


--
-- TOC entry 3563 (class 1259 OID 17002)
-- Name: idx_keyword_src_creative_version; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_keyword_src_creative_version ON public.affiliate_links USING btree (keyword, src, creative, version);


--
-- TOC entry 3564 (class 1259 OID 16994)
-- Name: idx_keyword_src_creative_version_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_keyword_src_creative_version_active ON public.affiliate_links USING btree (keyword, src, creative, version, is_active);


--
-- TOC entry 3565 (class 1259 OID 16996)
-- Name: idx_kscf_version; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_kscf_version ON public.affiliate_links USING btree (keyword, src, creative, fingerprint, version DESC);


-- Completed on 2025-05-08 16:51:20 IDT

--
-- PostgreSQL database dump complete
--

